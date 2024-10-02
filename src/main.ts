import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { applyMonkeyPatches } from "./patches/patches";

// we do not use the angular.json scripts section to load web-components so that
// we can get some nice tree-shaking
// https://github.com/angular/angular-cli/issues/24592#issuecomment-2049684550
import "@ecoacoustics/web-components";

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
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
