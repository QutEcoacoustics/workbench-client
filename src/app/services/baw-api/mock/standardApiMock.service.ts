import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { StandardApi } from "../api-common";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockStandardApiService extends StandardApi<MockModel, []> {
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

  public create() {
    return new Observable<MockModel>();
  }

  public update() {
    return new Observable<MockModel>();
  }

  public destroy() {
    return new Observable<MockModel | void>();
  }
}
