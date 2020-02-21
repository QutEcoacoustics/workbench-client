import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import {
  API_CONFIG,
  Configuration
} from "./app/services/app-config/app-config.service";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

(async () => {
  const res = await fetch("assets/environment.json")
    .then(response => response.json())
    .then((data: Configuration) => {
      return data;
    })
    .catch((err: any) => {
      console.error("APP_INITIALIZER: ", err);
      throw new Error("APP_INITIALIZER: Failed to load configuration file");
    });

  const apiConfigProvider = {
    provide: API_CONFIG,
    useValue: res
  };

  platformBrowserDynamic([apiConfigProvider])
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
})();
