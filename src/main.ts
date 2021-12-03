import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { embedGoogleMaps } from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { AppModule } from "./app/app.module";
import {
  API_CONFIG,
  Configuration,
} from "./app/helpers/app-initializer/app-initializer";
import { fetchRetry } from "./app/helpers/fetch-retry/fetchRetry";
import { environment } from "./environments/environment";
import "node_modules/web-components/build/dist/oe-components.all.js";

if (environment.production) {
  enableProdMode();
}

// Fetch API config from baw server and add it to the initial bootstrap
const apiConfigPromise = fetchRetry<Partial<Configuration>>(
  "assets/environment.json",
  1000,
  5
)
  .then(async (data) => {
    await embedGoogleMaps(data?.keys?.googleMaps);
    return new Configuration(data);
  })
  .catch((err: any) => {
    console.error("API_CONFIG Failed to load configuration file: ", err);
    return new Configuration(undefined);
  });

// Await page load
const domContentLoadedPromise = new Promise<void>((resolve) =>
  document.addEventListener("DOMContentLoaded", () => {
    document.removeEventListener("DOMContentLoader", () => {});
    resolve();
  })
);

// Bootstrap Angular
Promise.all([apiConfigPromise, domContentLoadedPromise]).then((result) => {
  const apiConfig: Configuration = result[0];

  // this provider should mirror that in server.ts
  platformBrowserDynamic([{ provide: API_CONFIG, useValue: apiConfig }])
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
