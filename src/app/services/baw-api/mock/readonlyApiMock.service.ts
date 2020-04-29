import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { ReadonlyApi } from "../api-common";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockReadonlyApiService extends ReadonlyApi<MockModel> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, MockModel);
  }

  public list() {
    return new Observable<MockModel[]>();
  }

  public filter() {
    return new Observable<MockModel[]>();
  }

  public show() {
    return new Observable<MockModel>();
  }
}
