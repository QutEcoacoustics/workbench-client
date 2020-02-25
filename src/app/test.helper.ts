import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  API_CONFIG,
  API_ROOT,
  CMS_ROOT
} from "./helpers/app-initializer/app-initializer";
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

export const testApiConfig = {
  environment: {
    apiRoot: "https://www.testing.com/api",
    siteRoot: "https://www.testing.com/site",
    siteDir: "<< siteDir >>",
    cmsRoot: "https://www.testing.com/cms",
    ga: {
      trackingId: "<< googleAnalytics >>"
    }
  },
  values: {
    keys: {
      googleMaps: "<< googleMaps >>"
    },
    brand: {
      name: "<< brandName >>",
      title: "<< brandTitle >>"
    },
    content: [
      {
        title: "<< content1 >>",
        url: "<< contentUrl1 >>"
      },
      {
        headerTitle: "<< content2 >>",
        items: [
          {
            title: "<< content3 >>",
            url: "<< contentUrl3 >>"
          },
          {
            title: "<< content4 >>",
            url: "<< contentUrl4 >>"
          }
        ]
      }
    ]
  }
};

export const testAppInitializer = [
  {
    provide: API_ROOT,
    useValue: testApiConfig.environment.apiRoot
  },
  {
    provide: CMS_ROOT,
    useValue: testApiConfig.environment.cmsRoot
  },
  {
    provide: API_CONFIG,
    useValue: new Promise(resolve => {
      Object.assign(environment, testApiConfig);
      resolve(testApiConfig);
    })
  }
];

export const testBawServices = [
  ...testAppInitializer,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true
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
