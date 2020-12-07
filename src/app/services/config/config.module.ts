import { APP_INITIALIZER, NgModule } from "@angular/core";
import {
  API_CONFIG,
  API_ROOT,
  AppInitializer,
} from "@helpers/app-initializer/app-initializer";
import { ToastrModule } from "ngx-toastr";
import { ConfigService } from "./config.service";

@NgModule({
  imports: [ToastrModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer.initializerFactory,
      multi: true,
      deps: [API_CONFIG],
    },
    {
      provide: API_ROOT,
      useFactory: AppInitializer.apiRootFactory,
    },
    ConfigService,
  ],
})
export class AppConfigModule {}
