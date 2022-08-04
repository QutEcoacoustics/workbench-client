import { defaultDebounceTime } from "src/app/app.helper";

declare let google: any;

export const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/js";
let node: HTMLScriptElement;

/**
 * Embed google maps script into the document. This makes use of the document
 * so it is not compatible with SSR, and is dangerous to use in tests
 *
 * @param key Google maps API key
 */
export async function embedGoogleMaps(key?: string): Promise<void> {
  let googleMapsUrl = googleMapsBaseUrl;
  if (key) {
    googleMapsUrl += "?key=" + key;
  }

  node = document.createElement("script");
  node.async = true;
  node.src = googleMapsUrl;
  node.type = "text/javascript";
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
export function destroyGoogleMaps() {
  document.getElementsByTagName("head")[0].removeChild(node);
}
