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
const apiConfig = fetchRetry<Partial<Configuration>>(
  "assets/environment.json",
  1000,
  5
)
  .then((data) => {
    let googleMapsUrl = `https://maps.googleapis.com/maps/api/js`;
    if (data?.values?.keys?.googleMaps) {
      googleMapsUrl += "?key=" + data.values.keys.googleMaps;
    }

    const node = document.createElement("script");
    node.src = googleMapsUrl;
    node.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(node);

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
