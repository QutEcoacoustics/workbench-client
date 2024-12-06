import { Inject, Injectable, signal } from "@angular/core";
import { defaultDebounceTime, IS_SERVER_PLATFORM } from "src/app/app.helper";
import { environment } from "src/environments/environment";

export enum MapState {
  NotLoaded,
  Loading,
  Loaded,
  Failed,
}

@Injectable({ providedIn: "root" })
export class MapsService {
  // By embedding the google maps script in the services constructor, we can
  // start loading the script as soon as the service is injected, and we don't
  // have to wait for the underlying component to be created.
  //
  // The underlying component can subscribe to the mapsState signal to know
  // when the google maps script has been loaded.
  public constructor(@Inject(IS_SERVER_PLATFORM) private isServer: boolean) {
    // while angular services are singletons, it is still possible to create
    // multiple instances of the service with hacky code
    // e.g. new MapsService()
    // This is a safeguard to prevent multiple instances of the service
    // from embedding the google maps script. It should not be triggered
    // in normal use, but is defensive programming against misuse.
    if (!MapsService.embeddedService) {
      MapsService.embeddedService = true;
      this.embedGoogleMaps();
    } else {
      console.warn("Google Maps Service already embedded.");
    }
  }

  private static embeddedService = false;

  public mapsState = signal<MapState>(MapState.NotLoaded);
  private promises: {
    res: (...args: any) => void;
    rej: (...args: any) => void;
  }[] = [];
  private googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/js";

  public loadedAsync(): Promise<unknown> {
    if (this.mapsState() === MapState.Loaded) {
      return Promise.resolve();
    }

    const newPromise = new Promise((res, rej) => {
      this.promises.push({ res, rej });
    });
    return newPromise;
  }

  /**
   * Embed google maps script into the document. This makes use of the document
   * so it is not compatible with SSR, and is dangerous to use in tests
   *
   * @param key Google maps API key
   */
  private async embedGoogleMaps(key?: string): Promise<void> {
    // TODO: during SSR we might be able to render a static image of the map
    // using the StaticMapService
    // https://developers.google.com/maps/documentation/maps-static/overview
    if (environment.testing || this.isServer) {
      return;
    }

    this.mapsState.set(MapState.Loading);

    let googleMapsUrl = this.googleMapsBaseUrl;
    if (key) {
      googleMapsUrl += `?key=${key}&callback=initMap`;
    }

    const node: HTMLScriptElement = document.createElement("script");
    node.id = "google-maps";
    node.type = "text/javascript";
    node.async = true;
    node.src = googleMapsUrl;

    node.addEventListener("error", () => {
      this.handleGoogleMapsFailed();
    });

    document.head.appendChild(node);

    // Detect when google maps properly embeds
    const instantiationRetries = 10;
    let count = 0;

    const mapLoaded = () => {
      if (typeof google !== "undefined") {
        this.handleGoogleMapsLoaded();
      } else if (count > instantiationRetries) {
        console.error("Failed to load google maps.");
        this.handleGoogleMapsFailed();
      } else {
        count++;
        setTimeout(() => mapLoaded(), defaultDebounceTime);
      }
    };

    mapLoaded();
  }

  private handleGoogleMapsLoaded(): void {
    this.mapsState.set(MapState.Loaded);
    this.promises.forEach(({ res }) => res());
  }

  private handleGoogleMapsFailed(): void {
    this.mapsState.set(MapState.Failed);
    this.promises.forEach(({ rej }) => rej());
  }
}
