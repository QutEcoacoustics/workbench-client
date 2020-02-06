import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfigService } from "../../app-config/app-config.service";
import { ApiShow, IdOr } from "../api-common";
import { BawApiService } from "../base-api.service";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockShowApiService extends BawApiService<MockModel>
  implements ApiShow<MockModel, [], IdOr<MockModel>> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, MockModel);
  }

  show() {
    return new Observable<MockModel>();
  }
}
