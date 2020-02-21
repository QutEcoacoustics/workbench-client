import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  apiRootFactory,
  API_ROOT,
  AppConfigService
} from "./services/app-config/app-config.service";
import { MockAppConfigService } from "./services/app-config/appConfigMock.service";
import { AccountService } from "./services/baw-api/account.service";
import { BawApiInterceptor } from "./services/baw-api/api.interceptor.service";
import {
  BawApiService,
  STUB_MODEL_BUILDER
} from "./services/baw-api/baw-api.service";
import {
  MockBawApiService,
  MockModel
} from "./services/baw-api/mock/baseApiMock.service";
import { MockReadonlyApiService } from "./services/baw-api/mock/readonlyApiMock.service";
import { MockSecurityService } from "./services/baw-api/mock/securityMock.service";
import { MockShowApiService } from "./services/baw-api/mock/showApiMock.service";
import { MockStandardApiService } from "./services/baw-api/mock/standardApiMock.service";
import { ProjectsService } from "./services/baw-api/projects.service";
import { SecurityService } from "./services/baw-api/security.service";
import {
  ShallowSitesService,
  SitesService
} from "./services/baw-api/sites.service";
import { UserService } from "./services/baw-api/user.service";

export const testAppInitializer = [
  {
    provide: AppConfigService,
    useClass: MockAppConfigService
  }
];

export const testBawServices = [
  ...testAppInitializer,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
  },
  {
    provide: API_ROOT,
    useFactory: apiRootFactory,
    deps: [AppConfigService]
  },
  { provide: STUB_MODEL_BUILDER, useValue: MockModel },
  { provide: BawApiService, useClass: MockBawApiService },
  { provide: SecurityService, useClass: MockSecurityService },
  { provide: AccountService, useClass: MockReadonlyApiService },
  { provide: ProjectsService, useClass: MockStandardApiService },
  { provide: SitesService, useClass: MockStandardApiService },
  { provide: ShallowSitesService, useClass: MockStandardApiService },
  { provide: UserService, useClass: MockShowApiService }
];
