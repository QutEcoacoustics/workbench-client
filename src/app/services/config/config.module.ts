import { HttpBackend } from "@angular/common/http";
import {
  NgModule,
  inject,
  provideAppInitializer,
} from "@angular/core";
import { AppInitializer } from "@helpers/app-initializer/app-initializer";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { ImportsService } from "@services/import/import.service";
import { ConfigService } from "./config.service";
import { API_CONFIG, API_ROOT } from "./config.tokens";

@NgModule({
  providers: [
    provideAppInitializer(() => {
      const initializerCallback = AppInitializer.initializerFactory(
        inject(API_CONFIG, { optional: true }),
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
    ConfigService,
    ImportsService,
  ],
})
export class ConfigModule {}
