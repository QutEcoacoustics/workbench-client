import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "src/app/models/User";
import { MockApiCommon } from "./api-commonMock";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends MockApiCommon<User> {
  public getMyAccount() {
    return new Subject();
  }

  public getUserAccount() {
    return new Subject();
  }
}
