import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { ServiceToken } from "@baw-api/ServiceTokens";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { StandardApi } from "../api-common";
import { MockModel } from "./baseApiMock.service";

export const MOCK = new ServiceToken<MockStandardApiService>(
  "STANDARD_API_SERVICE"
);

@Injectable()
export class MockStandardApiService extends StandardApi<MockModel> {
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

  public update(...args: any[]) {
    return new Observable<MockModel>();
  }

  public destroy(...args: any[]) {
    return new Observable<MockModel | void>();
  }
}
