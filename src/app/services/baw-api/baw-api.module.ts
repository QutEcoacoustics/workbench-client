import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppConfigModule } from "../config/config.module";
import { BawApiInterceptor } from "./api.interceptor.service";
import { BawApiStateService } from "./baw-api-state.service";
import { BawApiService } from "./baw-api.service";
import { BawFormApiService } from "./baw-form-api.service";
import { CmsService } from "./cms/cms.service";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";

@NgModule({
  imports: [HttpClientModule, AppConfigModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    BawApiService,
    BawFormApiService,
    BawApiStateService,
    SecurityService,
    CmsService,
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
  ],
})
export class BawApiModule {}
