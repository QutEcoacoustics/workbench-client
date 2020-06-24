import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
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
const apiConfig = fetchRetry("assets/environment.json", 1000, 5)
  .then((data) => {
    return new Configuration(data as Partial<Configuration>);
  })
  .catch((err: any) => {
    console.error("API_CONFIG Failed to load configuration file: ", err);
    return {};
  });

const apiConfigProvider = {
  provide: API_CONFIG,
  useValue: apiConfig,
};

platformBrowserDynamic([apiConfigProvider])
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
