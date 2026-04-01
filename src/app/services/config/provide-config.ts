import { HttpBackend } from "@angular/common/http";
import {
  EnvironmentProviders,
  Provider,
  inject,
  provideAppInitializer,
} from "@angular/core";
import { AppInitializer } from "@helpers/app-initializer/app-initializer";
import { ImportsService } from "@services/import/import.service";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { ConfigService } from "./config.service";
import { API_ROOT } from "./config.tokens";

export function provideConfig(): (EnvironmentProviders | Provider)[] {
  return [
    provideAppInitializer(() => {
      const initializerCallback = AppInitializer.initializerFactory(
        inject(ConfigService),
        inject(HttpBackend),
        inject(IS_SERVER_PLATFORM),
        inject(ImportsService)
      );

      return initializerCallback();
    }),
    {
      provide: API_ROOT,
      useFactory: AppInitializer.apiRootFactory,
      deps: [ConfigService],
    },
  ];
}
