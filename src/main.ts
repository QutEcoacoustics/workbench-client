import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import {
  API_ENVIRONMENT,
  Environment,
  ErrorEnvironment
} from "./app/helpers/app-initializer/app-initializer";
import { fetchRetry } from "./app/helpers/fetch-retry/fetchRetry";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

const apiConfig = fetchRetry("assets/environment.json", 1000, 5)
  .then(data => {
    return Object.assign(data as Partial<Environment>, {
      kind: "Environment"
    }) as Environment;
  })
  .catch((err: any) => {
    console.error("API_CONFIG Failed to load configuration file: ", err);
    return { kind: "ErrorEnvironment" } as ErrorEnvironment;
  });

const apiConfigProvider = {
  provide: API_ENVIRONMENT,
  useValue: apiConfig
};

platformBrowserDynamic([apiConfigProvider])
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
