import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { Params } from "@angular/router";
import { AccountService } from "@baw-api/account.service";
import { AnalysisJobsService } from "@baw-api/analysis-jobs.service";
import { BawApiInterceptor } from "@baw-api/api.interceptor.service";
import { AudioEventCommentsService } from "@baw-api/audio-event-comments.service";
import { AudioEventsService } from "@baw-api/audio-events.service";
import { BawApiService, STUB_MODEL_BUILDER } from "@baw-api/baw-api.service";
import { BookmarksService } from "@baw-api/bookmarks.service";
import {
  MockBawApiService,
  MockModel,
} from "@baw-api/mock/baseApiMock.service";
import { MockImmutableApiService } from "@baw-api/mock/immutableApiMock.service";
import { MockSecurityService } from "@baw-api/mock/securityMock.service";
import { MockShowApiService } from "@baw-api/mock/showApiMock.service";
import { MockStandardApiService } from "@baw-api/mock/standardApiMock.service";
import { ProgressEventsService } from "@baw-api/progress-events.service";
import { ProjectsService } from "@baw-api/projects.service";
import {
  QuestionsService,
  ShallowQuestionsService,
} from "@baw-api/questions.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SavedSearchesService } from "@baw-api/saved-searches.service";
import { ScriptsService } from "@baw-api/scripts.service";
import { SecurityService } from "@baw-api/security.service";
import { ShallowSitesService, SitesService } from "@baw-api/sites.service";
import { StudiesService } from "@baw-api/studies.service";
import { TagGroupService } from "@baw-api/tag-group.service";
import { TagsService } from "@baw-api/tags.service";
import { UserService } from "@baw-api/user.service";
import {
  API_CONFIG,
  API_ROOT,
  CMS_ROOT,
} from "@helpers/app-initializer/app-initializer";
import { AppConfigService } from "@services/app-config/app-config.service";
import {
  AppConfigMockService,
  testApiConfig,
} from "@services/app-config/appConfigMock.service";
import { BehaviorSubject } from "rxjs";

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
  { provide: AnalysisJobsService, useClass: MockStandardApiService },
  { provide: AudioEventCommentsService, useClass: MockStandardApiService },
  { provide: AudioEventsService, useClass: MockStandardApiService },
  { provide: BookmarksService, useClass: MockStandardApiService },
  { provide: ProgressEventsService, useClass: MockStandardApiService },
  { provide: ProjectsService, useClass: MockStandardApiService },
  { provide: QuestionsService, useClass: MockStandardApiService },
  { provide: ShallowQuestionsService, useClass: MockStandardApiService },
  { provide: SavedSearchesService, useClass: MockStandardApiService },
  { provide: ScriptsService, useClass: MockImmutableApiService },
  { provide: SitesService, useClass: MockStandardApiService },
  { provide: ShallowSitesService, useClass: MockStandardApiService },
  { provide: StudiesService, useClass: MockStandardApiService },
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
