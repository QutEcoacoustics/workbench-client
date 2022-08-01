import { defaultDebounceTime } from "src/app/app.helper";

declare let gtag: Gtag.Gtag;

export const googleTagsBaseUrl = "https://www.googletagmanager.com/gtag/js";
let node: HTMLScriptElement;

/**
 * Embed google analytics script into the document. This makes use of the
 * document so it is not compatible with SSR, and is dangerous to use in tests
 *
 * @param key Google analytics API key
 */
export async function embedGoogleAnalytics(key?: string): Promise<void> {
  let googleTagsUrl = googleTagsBaseUrl;
  if (key) {
    googleTagsUrl += "?id=" + key;
  }

  node = document.createElement("script");
  node.id = "google-analytics";
  node.type = "text/javascript";
  node.async = true;
  node.src = googleTagsUrl;
  document.getElementsByTagName("head")[0].appendChild(node);

  // Detect when google analytics properly embeds
  await new Promise<void>((resolve, reject) => {
    let count = 0;

    function analyticsLoaded(): void {
      if (typeof gtag !== "undefined") {
        gtag("js", new Date());
        gtag("config", key);
        resolve();
      } else if (count > 10) {
        console.error("Failed to load google analytics.");
        reject("Google Analytics API Bundle took too long to download.");
      } else {
        count++;
        setTimeout(() => analyticsLoaded(), defaultDebounceTime);
      }
    }

    analyticsLoaded();
  });
}

/**
 * Remove the google maps script from the document. This should
 * only be accessed by unit tests.
 */
export function destroyGoogleAnalytics(): void {
  document.getElementById("google-analytics").removeChild(node);
}
