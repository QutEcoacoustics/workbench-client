import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MockAppConfigModule } from "../app-config/app-configMock.module";
import { BawApiInterceptor } from "./api.interceptor.service";
import { BawApiService, STUB_MODEL_BUILDER } from "./baw-api.service";
import { MockBawApiService, MockModel } from "./mock/baseApiMock.service";
import { MockSecurityService } from "./mock/securityMock.service";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";

@NgModule({
  imports: [HttpClientModule, MockAppConfigModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    { provide: STUB_MODEL_BUILDER, useValue: MockModel },
    { provide: BawApiService, useClass: MockBawApiService },
    { provide: SecurityService, useClass: MockSecurityService },
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
  ],
})
export class MockBawApiModule {}
