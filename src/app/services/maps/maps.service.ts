import { Inject, Injectable } from "@angular/core";
import { sleep } from "@helpers/timing/sleep";
import { ConfigService } from "@services/config/config.service";
import { defaultDebounceTime, IS_SERVER_PLATFORM } from "src/app/app.helper";
import { environment } from "src/environments/environment";

export enum GoogleMapsState {
  NotLoaded,
  Loading,
  Loaded,
  Failed,
}

export type MapMarkerOptions = google.maps.MarkerOptions;
export type MapOptions = google.maps.MapOptions;

@Injectable({ providedIn: "root" })
export class MapsService {
  // By embedding the google maps script in the services constructor, we can
  // start loading the script as soon as the service is injected, and we don't
  // have to wait for the underlying component to be created.
  public constructor(
    @Inject(IS_SERVER_PLATFORM) private isServer: boolean,
    private config: ConfigService,
  ) {
    this.loadPromise = this.embedGoogleMaps();
  }

  public mapsState: GoogleMapsState = GoogleMapsState.NotLoaded;
  private loadPromise: Promise<boolean>;

  public loadAsync(): Promise<boolean> {
    return this.loadPromise;
  }

  /**
   * Embed google maps script into the document. This makes use of the document
   * so it is not compatible with SSR, and is dangerous to use in tests
   *
   * @param key Google maps API key
   */
  private async embedGoogleMaps(): Promise<boolean> {
    // TODO: during SSR we might be able to render a static image of the map
    // using the StaticMapService
    // https://developers.google.com/maps/documentation/maps-static/overview
    if (environment.testing || this.isServer) {
      return;
    }

    this.mapsState = GoogleMapsState.Loading;

    const googleMapsUrl = this.googleMapsBundleUrl();

    const node: HTMLScriptElement = document.createElement("script");

    const scriptErrorPromise = new Promise<boolean>((res) => {
      node.addEventListener("error", () => {
        this.logWarning("Error thrown in external script");
        this.mapsState = GoogleMapsState.Failed;
        res(false);
      });
    });

    node.id = "google-maps";
    node.type = "text/javascript";
    node.async = true;
    node.src = googleMapsUrl;

    document.head.appendChild(node);

    return Promise.race([scriptErrorPromise, this.waitForGoogleNamespace()]) as Promise<boolean>;
  }

  private async waitForGoogleNamespace(): Promise<boolean> {
    const instantiationRetries = 10;

    for (let retry = 0; retry < instantiationRetries; retry++) {
      // because the "google" global namespace is loaded by the google maps
      // script, we can check if it is defined to determine if the script has
      // been successfully loaded
      if (
        typeof google !== "undefined" &&
        typeof google.maps !== "undefined" &&
        typeof google.maps.importLibrary !== "undefined"
      ) {
        this.mapsState = GoogleMapsState.Loaded;
        return true;
      }

      await sleep(defaultDebounceTime);
    }

    this.logWarning("Unable to find 'google' namespace");

    return false;
  }

  private googleMapsBundleUrl(): string {
    // using loading=async requests a version of the google maps api that does not
    // block the main thread while loading
    // this can improve performance and removes a warning from the dev console
    const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/js?loading=async";

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

  private logWarning(message: string): void {
    console.warn(`Maps: ${message}`);
  }
}
