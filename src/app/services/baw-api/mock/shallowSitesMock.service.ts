import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MockModel } from "./baseApiMock.service";
import { MockStandardApiService } from "./standardApiMock.service";

@Injectable()
export class MockShallowSitesService extends MockStandardApiService {
  public orphans(...args: any[]) {
    return new Observable<MockModel[]>();
  }
}
