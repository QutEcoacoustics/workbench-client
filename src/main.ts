import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import embedGoogleMaps from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { AppModule } from "./app/app.module";
import {
  API_CONFIG,
  Configuration,
} from "./app/helpers/app-initializer/app-initializer";
import { fetchRetry } from "./app/helpers/fetch-retry/fetchRetry";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

// Fetch API config from baw server and add it to the initial bootstrap
const apiConfig = fetchRetry<Partial<Configuration>>(
  "assets/environment.json",
  1000,
  5
)
  .then((data) => {
    embedGoogleMaps(data?.values?.keys?.googleMaps);
    return new Configuration(data);
  })
  .catch((err: any) => {
    console.error("API_CONFIG Failed to load configuration file: ", err);
    return {};
  });

platformBrowserDynamic([
  {
    provide: API_CONFIG,
    useValue: apiConfig,
  },
])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
