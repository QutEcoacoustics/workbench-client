import { Inject, Injectable } from "@angular/core";
import { ConfigService } from "@services/config/config.service";
import { defaultDebounceTime, IS_SERVER_PLATFORM } from "src/app/app.helper";
import { environment } from "src/environments/environment";

export enum GoogleMapsState {
  NotLoaded,
  Loading,
  Loaded,
  Failed,
}

interface SharedPromise {
  promise: Promise<unknown>;
  resolve: (...args: void[]) => void;
  reject: (...args: void[]) => void;
}

@Injectable({ providedIn: "root" })
export class MapsService {
  // By embedding the google maps script in the services constructor, we can
  // start loading the script as soon as the service is injected, and we don't
  // have to wait for the underlying component to be created.
  public constructor(
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean,
    private config: ConfigService,
  ) {
    // while angular services are singletons, it is still possible to create
    // multiple instances of the service with hacky code
    // e.g. new MapsService()
    // This is a safeguard to prevent multiple instances of the service
    // from embedding the google maps script. It should not be triggered
    // in normal use, but is defensive programming against misuse.
    if (!MapsService.embeddedService) {
      MapsService.embeddedService = true;

      let resolver: (value: unknown) => void;
      let rejector: (reason?: unknown) => void;
      const promise = new Promise((res, rej) => {
        resolver = res;
        rejector = rej;
      });

      this.loadPromise = { promise, resolve: resolver, reject: rejector };

      this.embedGoogleMaps();
    } else {
      console.warn("Google Maps Service already embedded.");
    }
  }

  private static embeddedService = false;

  public mapsState: GoogleMapsState = GoogleMapsState.NotLoaded;
  private readonly loadPromise: SharedPromise;

  public loadAsync(): Promise<unknown> {
    // if we have previously loaded the maps, return immediately with the
    // correct resolved/rejected state
    //
    // we obviously can't return "this.loadPromise" directly as it'd never
    // resolve because the res() and rej() functions would not be called because
    // the maps loaded state has already settled
    // (promises only resolve/reject once and do not emit their last value
    // to new awaiters)
    if (this.mapsState === GoogleMapsState.Loaded) {
      return Promise.resolve();
    } else if (this.mapsState === GoogleMapsState.Failed) {
      return Promise.reject();
    }

    return this.loadPromise.promise;
  }

  /**
   * Embed google maps script into the document. This makes use of the document
   * so it is not compatible with SSR, and is dangerous to use in tests
   *
   * @param key Google maps API key
   */
  private async embedGoogleMaps(): Promise<void> {
    // TODO: during SSR we might be able to render a static image of the map
    // using the StaticMapService
    // https://developers.google.com/maps/documentation/maps-static/overview
    if (environment.testing || this.isServer) {
      return;
    }

    this.mapsState = GoogleMapsState.Loading;

    const googleMapsUrl = this.googleMapsBundleUrl();

    const node: HTMLScriptElement = document.createElement("script");
    node.addEventListener("error", () => {
      this.handleGoogleMapsFailed();
    });

    node.id = "google-maps";
    node.type = "text/javascript";
    node.async = true;
    node.src = googleMapsUrl;

    document.head.appendChild(node);

    // Detect when google maps properly embeds
    // TODO: This is a bit of a hack and we should find a better way to detect
    // when the google namespace is available
    const instantiationRetries = 10;
    let count = 0;

    const mapLoaded = () => {
      if (typeof google !== "undefined") {
        this.handleGoogleMapsLoaded();
      } else if (count > instantiationRetries) {
        this.handleGoogleMapsFailed();
      } else {
        count++;
        setTimeout(() => mapLoaded(), defaultDebounceTime);
      }
    };

    mapLoaded();
  }

  private googleMapsBundleUrl(): string {
    // using loading=async requests a version of the google maps api that does not
    // block the main thread while loading
    // this can improve performance and removes a warning from the dev console
    const googleMapsBaseUrl =
      "https://maps.googleapis.com/maps/api/js?loading=async";

    const mapsKey = this.config.keys.googleMaps;

    let googleMapsUrl = googleMapsBaseUrl;
    if (mapsKey) {
      // TODO: migrate to google.maps.AdvancedMarkerElement once we bump the
      // Angular version
      // https://developers.google.com/maps/documentation/javascript/advanced-markers/migration
      googleMapsUrl += `&key=${mapsKey}`;
    }

    return googleMapsUrl;
  }

  private handleGoogleMapsLoaded(): void {
    this.mapsState = GoogleMapsState.Loaded;
    this.loadPromise.resolve();
  }

  private handleGoogleMapsFailed(): void {
    console.error("Failed to load google maps.");
    this.mapsState = GoogleMapsState.Failed;
    this.loadPromise.reject();
  }
}
