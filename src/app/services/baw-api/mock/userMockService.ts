import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "src/app/models/User";
import { MockModelService } from "./modelMockService";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends MockModelService<User> {
  public getMyAccount() {
    return new Subject();
  }

  public getUserAccount() {
    return new Subject();
  }
}
