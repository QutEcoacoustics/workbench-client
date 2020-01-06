import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BawApiService } from "../base-api.service";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends BawApiService {
  public getMyAccount() {
    return new Subject();
  }

  public getUserAccount() {
    return new Subject();
  }
}
