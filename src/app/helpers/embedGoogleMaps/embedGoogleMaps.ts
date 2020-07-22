export const googleMapsBaseUrl = "https://maps.googleapis.com/maps/api/js";

let node: HTMLScriptElement;

/**
 * Embed google maps script into the document. This should only be
 * access by `main.ts` or unit tests.
 * @param key Google maps API key
 */
export async function embedGoogleMaps(key?: string) {
  let googleMapsUrl = googleMapsBaseUrl;
  if (key) {
    googleMapsUrl += "?key=" + key;
  }

  node = document.createElement("script");
  node.src = googleMapsUrl;
  node.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(node);

  await new Promise((resolve, reject) => {
    node.onload = () => resolve();
    node.onerror = () => reject();
  });
}

/**
 * Remove the google maps script from the document. This should
 * only be accessed by unit tests.
 */
export function destroyGoogleMaps() {
  document.getElementsByTagName("head")[0].removeChild(node);
}
