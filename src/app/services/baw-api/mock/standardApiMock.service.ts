import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { StandardApi } from "../api-common";
import { STUB_API_ROOT } from "../baw-api.service";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockStandardApiService extends StandardApi<MockModel, []> {
  constructor(http: HttpClient, @Inject(STUB_API_ROOT) apiRoot: string) {
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
