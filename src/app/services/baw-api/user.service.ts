import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User, UserInterface } from "src/app/models/User";
import { BawApiService } from "./base-api.service";
import { SecurityService } from "./security.service";

@Injectable({
  providedIn: "root"
})
export class UserService extends BawApiService {
  constructor(private securityApi: SecurityService, http: HttpClient) {
    super(http);

    this.paths = {
      myAccount: "/my_account",
      userAccount: "/user_accounts/:userId"
    };
  }

  /**
   * Get the account details of the current logged in user
   * @returns Observable returning current user details
   */
  getMyAccount(): Subject<User> {
    const subject = new Subject<User>();
    const callback = (user: UserInterface) => new User(user);

    this.securityApi.getLoggedInTrigger().subscribe({
      next: loggedIn => {
        if (loggedIn) {
          this.details(subject, callback, this.paths.myAccount);
        } else {
          subject.next(null);
        }
      },
      error: err => subject.error(err)
    });

    return subject;
  }

  /**
   * Get the user account details of another user
   * @param id User ID
   * @returns Observable returning user details
   */
  getUserAccount(id: ID): Subject<User> {
    const subject = new Subject<User>();
    const callback = (user: UserInterface) => new User(user);

    this.details(subject, callback, this.paths.userAccount, {
      args: { userId: id }
    });

    return subject;
  }
}
