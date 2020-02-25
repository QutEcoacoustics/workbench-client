import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "../../app-config/app-config.service";
import { ReadonlyApi } from "../api-common";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockReadonlyApiService extends ReadonlyApi<MockModel, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, MockModel);
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
