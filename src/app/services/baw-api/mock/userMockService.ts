import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { BawApiService } from "../base-api.service";
import { SecurityService } from "../security.service";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends BawApiService {
  constructor(private securityApi: SecurityService, http: HttpClient) {
    super(http);
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  getMyAccount(): Subject<User> {
    const subject = new Subject<User>();

    return subject;
  }

  /**
   * Get the user account details of another user
   * @param id User ID
   * @returns Observable returning user details
   */
  getUserAccount(id: ID): Subject<User> {
    const subject = new Subject<User>();

    return subject;
  }
}
