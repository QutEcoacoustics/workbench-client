import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MockStandardApiService } from "./apiMocks.service";
import { MockModel } from "./baseApiMock.service";

@Injectable()
export class MockShallowSitesService extends MockStandardApiService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public orphans(...args: any[]) {
    return new Observable<MockModel[]>();
  }
}
