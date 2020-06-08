import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MockStandardApiService } from "./apiMocks.service";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockShallowSitesService extends MockStandardApiService {
  public orphans(...args: any[]) {
    return new Observable<MockModel[]>();
  }
}
