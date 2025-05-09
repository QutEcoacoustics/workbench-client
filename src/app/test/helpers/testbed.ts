import { HttpHeaders } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Data, Params, provideRouter } from "@angular/router";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ResolvedModel } from "@baw-api/resolver-common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { formlyConfig } from "@shared/formly/custom-inputs.module";
import { LoadingComponent } from "@shared/loading/loading.component";
import { IMockBuilder } from "ng-mocks";
import { NgxCaptchaModule } from "ngx-captcha";
import { BehaviorSubject } from "rxjs";

export const testFormImports = [
  NgbModule,
  ReactiveFormsModule,
  FormlyModule.forRoot(formlyConfig),
  FormlyBootstrapModule,
  NgxCaptchaModule,

  LoadingComponent,
];

export const testFormProviders = [
  provideMockBawApi(),
  provideRouter([]),
];

export function addStandardFormImportsToMockBuilder(builder: IMockBuilder) {
  const module = builder.build();

  // https://github.com/help-me-mom/ng-mocks/issues/197#issuecomment-705431358
  module.imports = [...module.imports, ...testFormImports];
  module.providers = [...module.providers, ...testFormProviders];

  return TestBed.configureTestingModule(module).compileComponents();
}

/**
 * Create a mock ActivatedRoute class
 *
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
  return {
    snapshot: {
      data: resolvers ? { resolvers, ...data } : data,
      params,
      queryParams,
    },
    data: new BehaviorSubject<Data>({ resolvers, ...data }),
    params: new BehaviorSubject<Params>(params),
    queryParams: new BehaviorSubject<Params>(queryParams),
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
  | Record<string, any>
  | (string | number | Record<string, any> | null)[]
  | null;

export interface HttpClientOpts {
  headers?: HttpHeaders | { [name: string]: string | string[] };
  status?: number;
  statusText?: string;
}
