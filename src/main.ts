import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import {
  API_ENVIRONMENT,
  Environment,
  ErrorEnvironment
} from "./app/helpers/app-initializer/app-initializer";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
}

/**
 * Fetch request with multiple attempts
 * @param url URL
 * @param delay Delay amount in milliseconds
 * @param limit Maximum number of attempts
 * @param options Fetch options
 */
function fetchRetry(
  url: string,
  delay: number,
  limit: number,
  options = {}
): Promise<Response> {
  return new Promise((resolve, reject) => {
    let wrappedFetch = attempt => {
      fetch(url, options).then(response => {
        if (response.status !== 200) {
          retry(attempt);
          return;
        }

        try {
          const res = response.json();
          resolve(res);
        } catch (err) {
          retry(attempt);
        }
      });
    };

    function retry(attempt: number) {
      if (attempt >= limit - 1) {
        const msg = "Failed to fetch item after " + limit + " attempt/s.";
        reject(msg);
        return;
      }

      setTimeout(() => {
        wrappedFetch(++attempt);
      }, delay);
    }

    wrappedFetch(0);
  });
}

const apiConfig = fetchRetry("assets/environment.jsonh", 500, 5)
  .then(data => {
    return Object.assign(data as Partial<Environment>, {
      kind: "Configuration"
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
