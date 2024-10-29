import { HttpBackend } from "@angular/common/http";
import { APP_INITIALIZER, NgModule, Optional } from "@angular/core";
import { AppInitializer } from "@helpers/app-initializer/app-initializer";
import { ToastrModule } from "ngx-toastr";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { ImportsService } from "@services/imports/imports.service";
import { ConfigService } from "./config.service";
import { API_CONFIG, API_ROOT } from "./config.tokens";

@NgModule({
  imports: [ToastrModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer.initializerFactory,
      deps: [
        [new Optional(), API_CONFIG],
        ConfigService,
        ImportsService,
        HttpBackend,
        IS_SERVER_PLATFORM,
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
