import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "../../app-config/app-config.service";
import { ApiShow, IdOr } from "../api-common";
import { BawApiService } from "../baw-api.service";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockShowApiService extends BawApiService<MockModel>
  implements ApiShow<MockModel, [], IdOr<MockModel>> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, MockModel);
  }

  show() {
    return new Observable<MockModel>();
  }
}
