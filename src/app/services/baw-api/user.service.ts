import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon } from "./api-common";
import { Path } from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class UserService extends ApiCommon<User> {
  private paths: {
    [key: string]: Path;
  };

  constructor(http: HttpClient, config: AppConfigService, router: Router) {
    super(http, config, router, User);

    this.paths = {
      myAccount: this.makeTemplate`/my_account`,
      userAccount: this.makeTemplate`/user_accounts/${this.id}`
    };
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  public getMyAccount(): Subject<User> {
    return this.show(this.paths.myAccount(), null);
  }

  /**
   * Get the user account details of another user
   * @param userId User ID
   * @returns Observable returning user details
   */
  public getUserAccount(userId: ID): Subject<User> {
    return this.show(this.paths.userAccount(userId), null);
  }
}
