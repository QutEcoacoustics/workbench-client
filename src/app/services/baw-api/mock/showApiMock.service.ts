import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { ApiShow, IdOr } from "../api-common";
import { BawApiService } from "../baw-api.service";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockShowApiService extends BawApiService<MockModel>
  implements ApiShow<MockModel, [], IdOr<MockModel>> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, MockModel, injector);
  }

  show() {
    return new Observable<MockModel>();
  }
}
