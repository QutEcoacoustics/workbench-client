import { HttpBackend } from "@angular/common/http";
import { APP_INITIALIZER, NgModule, Optional } from "@angular/core";
import { AppInitializer } from "@helpers/app-initializer/app-initializer";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { ImportsService } from "@services/import/import.service";
import { ConfigService } from "./config.service";
import { API_CONFIG, API_ROOT } from "./config.tokens";

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer.initializerFactory,
      deps: [
        [new Optional(), API_CONFIG],
        ConfigService,
        HttpBackend,
        IS_SERVER_PLATFORM,
        ImportsService,
      ],
      multi: true,
    },
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
