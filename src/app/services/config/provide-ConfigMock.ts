import { Provider } from "@angular/core";
import { Configuration } from "@helpers/app-initializer/app-initializer";
import { API_ROOT, API_CONFIG } from "./config.tokens";
import { testApiConfig } from "./configMock.service";

export function provideMockConfig(): Provider[] {
  return [
    {
      provide: API_ROOT,
      useValue: testApiConfig.endpoints.apiRoot,
    },
    {
      provide: API_CONFIG,
      useValue: new Promise<Configuration>((resolve) => {
        resolve(testApiConfig);
      }),
    },
  ];
}
