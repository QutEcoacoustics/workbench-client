import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { ApiFilter } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { Observable } from "rxjs";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockFilterApiService extends BawApiService<MockModel>
  implements ApiFilter<MockModel> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, MockModel, injector);
  }

  filter() {
    return new Observable<MockModel[]>();
  }
}
