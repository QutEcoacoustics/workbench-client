import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { environment } from "./environments/environment";
import { applyMonkeyPatches } from "./patches/patches";
import { AppComponent } from "./app/app.component";
import { appConfig } from "./app.config";

applyMonkeyPatches();

if (environment.production) {
  enableProdMode();
}

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
