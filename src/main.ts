import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "./environments/environment";
import { applyMonkeyPatches } from "./patches/patches";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

applyMonkeyPatches();

if (environment.production) {
  enableProdMode();
}

// TODO: we should find out if we still need to await the page load and why we
// originally added this code.
// Angular doesn't recommend this, so I suspect that it was added to fix some
// sort of undocumented bug.
// Await page load
const domContentLoadedPromise = new Promise<void>((resolve) =>
  document.addEventListener("DOMContentLoaded", () => {
    document.removeEventListener("DOMContentLoader", () => {});
    resolve();
  })
);

// Bootstrap Angular
domContentLoadedPromise.then(() => {
  bootstrapApplication(AppComponent, appConfig).catch((err) => {
    console.error(err);
  });
});
