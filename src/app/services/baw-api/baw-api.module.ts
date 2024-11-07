import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { CacheModule } from "@services/cache/cache.module";
import { ToastrModule } from "ngx-toastr";
import { AssociationInjectorService } from "@services/association-injector/association-injector.service";
import { ConfigModule } from "../config/config.module";
import { BawApiInterceptor } from "./api.interceptor.service";
import { BawApiService } from "./baw-api.service";
import { BawFormApiService } from "./baw-form-api.service";
import { BawSessionService } from "./baw-session.service";
import { CmsService } from "./cms/cms.service";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";
import { ASSOCIATION_INJECTOR } from "./ServiceTokens";

@NgModule({
  imports: [HttpClientModule, ConfigModule, CacheModule, ToastrModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    {
      provide: ASSOCIATION_INJECTOR.token,
      useClass: AssociationInjectorService,
    },
    BawApiService,
    BawFormApiService,
    BawSessionService,
    SecurityService,
    CmsService,
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
  ],
})
export class BawApiModule {}
