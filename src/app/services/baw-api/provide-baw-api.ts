import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { EnvironmentProviders, Provider } from "@angular/core";
import { associationInjectorProvider } from "@services/association-injector/association-injector.factory";
import { provideCaching } from "@services/cache/provide-caching";
import { TaggingCorrectionsService } from "@services/models/tagging-corrections/tagging-corrections.service";
import { provideConfig } from "../config/provide-config";
import { BawApiInterceptor } from "./api.interceptor.service";
import { BawApiService } from "./baw-api.service";
import { BawFormApiService } from "./baw-form-api.service";
import { BawSessionService } from "./baw-session.service";
import { CmsService } from "./cms/cms.service";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";

export function provideBawApi(): (EnvironmentProviders | Provider)[] {
  return [
    provideConfig(),
    provideCaching(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    associationInjectorProvider,
    BawApiService,
    BawFormApiService,
    BawSessionService,
    SecurityService,
    CmsService,
    TaggingCorrectionsService,
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
  ];
}
