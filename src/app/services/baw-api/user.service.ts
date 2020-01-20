import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon } from "./api-common";

@Injectable({
  providedIn: "root"
})
export class UserService extends ApiCommon<User> {
  private paths: {
    [key: string]: string;
  };

  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, User);

    this.paths = {
      myAccount: "/my_account",
      userAccount: "/user_accounts/:userId"
    };
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  public getMyAccount(): Subject<User> {
    return this.show(this.paths.myAccount, null);
  }

  /**
   * Get the user account details of another user
   * @param userId User ID
   * @returns Observable returning user details
   */
  public getUserAccount(userId: ID): Subject<User> {
    return this.show(this.paths.userAccount, null, userId);
  }
}
