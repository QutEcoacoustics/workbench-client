import { HttpHeaders, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ActivatedRouteSnapshot, Data, Params } from "@angular/router";
import { BawApiInterceptor } from "@baw-api/api.interceptor.service";
import { BawApiService, STUB_MODEL_BUILDER } from "@baw-api/baw-api.service";
import {
  MockBawApiService,
  MockModel,
} from "@baw-api/mock/baseApiMock.service";
import { MockSecurityService } from "@baw-api/mock/securityMock.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { SecurityService } from "@baw-api/security/security.service";
import { serviceMockProviders } from "@baw-api/ServiceProviders";
import {
  API_CONFIG,
  API_ROOT,
  ASSET_ROOT,
  CMS_ROOT,
  Configuration,
} from "@helpers/app-initializer/app-initializer";
import { AppConfigService } from "@services/app-config/app-config.service";
import {
  AppConfigMockService,
  testApiConfig,
} from "@services/app-config/appConfigMock.service";
import { BehaviorSubject } from "rxjs";
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { formlyRoot, toastrRoot } from "src/app/app.helper";
import { ToastrModule } from "ngx-toastr";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { LoadingModule } from "@shared/loading/loading.module";

export const testFormImports = [
  CommonModule,
  BrowserModule,
  BrowserAnimationsModule,
  NgbModule,
  ReactiveFormsModule,
  FormlyModule.forRoot(formlyRoot),
  FormlyBootstrapModule,
  ToastrModule.forRoot(toastrRoot),
  HttpClientTestingModule,
  RouterTestingModule,
  LoadingModule,
];

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
    provide: ASSET_ROOT,
    useValue: testApiConfig.environment.assetRoot,
  },
  {
    provide: API_CONFIG,
    useValue: new Promise<Configuration>((resolve) => {
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
  ...serviceMockProviders,
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
    public snapshot: Partial<ActivatedRouteSnapshot> = {
      data: { resolvers, ...data },
      params,
      queryParams,
    };
    public data = new BehaviorSubject<Data>({ resolvers, ...data });
    public params = new BehaviorSubject<Params>(params);
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

export type HttpClientBody =
  | ArrayBuffer
  | Blob
  | string
  | number
  // tslint:disable-next-line: ban-types
  | Object
  // tslint:disable-next-line: ban-types
  | (string | number | Object | null)[]
  | null;
export interface HttpClientOpts {
  headers?:
    | HttpHeaders
    | {
        [name: string]: string | string[];
      };
  status?: number;
  statusText?: string;
}
