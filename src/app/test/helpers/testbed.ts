import { CommonModule } from "@angular/common";
import { HttpHeaders } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRouteSnapshot, Data, Params } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ResolvedModel } from "@baw-api/resolver-common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingModule } from "@shared/loading/loading.module";
import { ToastrModule } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { formlyRoot, toastrRoot } from "src/app/app.helper";

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
  headers?: HttpHeaders | { [name: string]: string | string[] };
  status?: number;
  statusText?: string;
}
