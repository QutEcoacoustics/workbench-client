import { environment } from "src/environments/environment";

declare let gtag: Gtag.Gtag;

export const googleTagsBaseUrl = "https://www.googletagmanager.com/gtag/js";

/**
 * Embed google analytics script into the document. This makes use of the
 * document so it is not compatible with SSR, and is dangerous to use in tests
 *
 * @param key Google analytics API key
 */
export function embedGoogleAnalytics(key?: string): void {
  // Do not insert during testing
  if (environment.testing) {
    return;
  }

  let googleTagsUrl = googleTagsBaseUrl;
  if (key) {
    googleTagsUrl += "?id=" + key;
  }

  // Create Create dataLayer for google analytics:
  // developers.google.com/tag-platform/tag-manager/web/datalayer
  window["dataLayer"] = window["dataLayer"] || [];
  window["gtag"] = function (...args: any) {
    window["dataLayer"].push(args);
  };

  gtag("js", new Date());
  gtag("config", key);

  const node: HTMLScriptElement = document.createElement("script");
  node.id = "google-analytics";
  node.type = "text/javascript";
  node.async = true;
  node.src = googleTagsUrl;
  document.getElementsByTagName("head")[0].appendChild(node);
}

/**
 * Remove the google maps script from the document. This should
 * only be accessed by unit tests.
 */
export function destroyGoogleAnalytics(): void {
  document.getElementById("google-analytics").remove();
}
