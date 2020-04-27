import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Params } from "@angular/router";
import { MockImmutableApiService } from "@baw-api/mock/immutableApiMock.service";
import { BehaviorSubject } from "rxjs";
import {
  API_CONFIG,
  API_ROOT,
  CMS_ROOT,
} from "../../helpers/app-initializer/app-initializer";
import { AppConfigService } from "../../services/app-config/app-config.service";
import {
  AppConfigMockService,
  testApiConfig,
} from "../../services/app-config/appConfigMock.service";
import { AccountService } from "../../services/baw-api/account.service";
import { BawApiInterceptor } from "../../services/baw-api/api.interceptor.service";
import {
  BawApiService,
  STUB_MODEL_BUILDER,
} from "../../services/baw-api/baw-api.service";
import {
  MockBawApiService,
  MockModel,
} from "../../services/baw-api/mock/baseApiMock.service";
import { MockSecurityService } from "../../services/baw-api/mock/securityMock.service";
import { MockShowApiService } from "../../services/baw-api/mock/showApiMock.service";
import { MockStandardApiService } from "../../services/baw-api/mock/standardApiMock.service";
import { ProjectsService } from "../../services/baw-api/projects.service";
import { ResolvedModel } from "../../services/baw-api/resolver-common";
import { ScriptsService } from "../../services/baw-api/scripts.service";
import { SecurityService } from "../../services/baw-api/security.service";
import {
  ShallowSitesService,
  SitesService,
} from "../../services/baw-api/sites.service";
import { TagGroupService } from "../../services/baw-api/tag-group.service";
import { TagsService } from "../../services/baw-api/tags.service";
import { UserService } from "../../services/baw-api/user.service";

/**
 * Create mock initializer values
 */
export const testAppInitializer = [
  {
    provide: API_ROOT,
    useValue: testApiConfig.environment.apiRoot,
  },
  {
    provide: CMS_ROOT,
    useValue: testApiConfig.environment.cmsRoot,
  },
  {
    provide: API_CONFIG,
    useValue: new Promise((resolve) => {
      resolve(testApiConfig);
    }),
  },
  {
    provide: AppConfigService,
    useClass: AppConfigMockService,
  },
];

/**
 * Mock classes for baw services
 */
export const testBawServices = [
  ...testAppInitializer,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: BawApiInterceptor,
    multi: true,
  },
  { provide: STUB_MODEL_BUILDER, useValue: MockModel },
  { provide: BawApiService, useClass: MockBawApiService },
  { provide: SecurityService, useClass: MockSecurityService },
  { provide: AccountService, useClass: MockStandardApiService },
  { provide: ProjectsService, useClass: MockStandardApiService },
  { provide: ScriptsService, useClass: MockImmutableApiService },
  { provide: SitesService, useClass: MockStandardApiService },
  { provide: ShallowSitesService, useClass: MockStandardApiService },
  { provide: TagsService, useClass: MockStandardApiService },
  { provide: TagGroupService, useClass: MockStandardApiService },
  { provide: UserService, useClass: MockShowApiService },
];

/**
 * Create a mock ActivatedRoute class
 * @param resolvers Activated Route Data Resolvers
 * @param data Activated Route Data
 * @param params Activated Route Params
 * @param queryParams Activated Route Query Params
 */
export function mockActivatedRoute(
  resolvers: MockResolvers = {},
  data: MockData = {},
  params: MockParams = {},
  queryParams: Params = {}
) {
  return class MockActivatedRoute {
    public snapshot = { data: { resolvers, ...data }, params, queryParams };
    public data = new BehaviorSubject<any>({ resolvers, ...data });
    public params = new BehaviorSubject<any>(params);
    public queryParams = new BehaviorSubject<Params>(queryParams);
  };
}

export interface MockResolvers {
  [key: string]: string;
}
export interface MockData {
  [key: string]: ResolvedModel;
}
export interface MockParams {
  [key: string]: string | number;
}
