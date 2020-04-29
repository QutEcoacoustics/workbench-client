import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ImmutableApi } from "@baw-api/api-common";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockImmutableApiService extends ImmutableApi<MockModel> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, MockModel);
  }

  public list(...args: any[]) {
    return new Observable<MockModel[]>();
  }

  public filter(...args: any[]) {
    return new Observable<MockModel[]>();
  }

  public show(...args: any[]) {
    return new Observable<MockModel>();
  }

  public create(...args: any[]) {
    return new Observable<MockModel>();
  }

  public destroy(...args: any[]) {
    return new Observable<MockModel | void>();
  }
}
