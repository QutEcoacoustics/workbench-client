import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/models/User";
import { ApiShow, IdOr } from "../api-common";
import { MockBawApiService } from "./baseApiMockService";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends MockBawApiService
  implements ApiShow<User, [], IdOr<User>> {
  show() {
    return new Observable<User>();
  }
}
