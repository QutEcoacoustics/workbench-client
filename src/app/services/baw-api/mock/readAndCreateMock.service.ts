import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { ReadAndCreateApi } from "@baw-api/api-common";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockReadAndCreateApiService extends ReadAndCreateApi<MockModel> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, MockModel, injector);
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
}
