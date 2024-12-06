import { Injectable } from "@angular/core";
import { defaultDebounceTime } from "src/app/app.helper";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class MapsService {
  public constructor() {
    this.embedGoogleMaps();
  }

  private googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/js";

  public googleMapsLoaded(): boolean {
    let isDefined = false;
    try {
      isDefined = !!google;
    } catch (err) {
      console.error(err);
    }
    return isDefined;
  }

  /**
   * Embed google maps script into the document. This makes use of the document
   * so it is not compatible with SSR, and is dangerous to use in tests
   *
   * @param key Google maps API key
   */
  private async embedGoogleMaps(key?: string): Promise<void> {
    // Do not insert during testing
    if (environment.testing) {
      return;
    }

    let googleMapsUrl = this.googleMapsBaseUrl;
    if (key) {
      googleMapsUrl += "?key=" + key;
    }

    const node: HTMLScriptElement = document.createElement("script");
    node.id = "google-maps";
    node.type = "text/javascript";
    node.async = true;
    node.src = googleMapsUrl;
    document.getElementsByTagName("head")[0].appendChild(node);

    // Detect when google maps properly embeds
    await new Promise<void>((resolve, reject) => {
      let count = 0;

      function mapLoaded(): void {
        if (typeof google !== "undefined") {
          resolve();
        } else if (count > 10) {
          console.error("Failed to load google maps.");
          reject("Google Maps API Bundle took too long to download.");
        } else {
          count++;
          setTimeout(() => mapLoaded(), defaultDebounceTime);
        }
      }

      mapLoaded();
    });
  }

  /**
   * Remove the google maps script from the document. This should
   * only be accessed by unit tests.
   */
  private destroyGoogleMaps(): void {
    document.getElementById("google-maps").remove();
  }
}
