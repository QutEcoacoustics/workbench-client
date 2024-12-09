/**
 * Remove the google maps script from the document. This should
 * only be accessed by unit tests.
 */
export function destroyGoogleMaps(): void {
  document.getElementById("google-maps").remove();
}
