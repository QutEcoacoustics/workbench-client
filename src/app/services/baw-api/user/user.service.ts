import { Injectable } from "@angular/core";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ConfirmPassword } from "@models/data/ConfirmPassword";
import { ResetPassword } from "@models/data/ResetPassword";
import { UnlockAccount } from "@models/data/UnlockAccount";
import { User } from "@models/User";
import { Observable } from "rxjs";
import { ApiShow, emptyParam, newParam, option, param } from "../api-common";
import { ShowResolver } from "../resolver-common";

const confirmationParam = "confirmation" as const;
const passwordParam = "password" as const;
const unlockParam = "unlock" as const;

const endpoint = stringTemplate`/my_account/${param}${option}`;

/**
 * User Service.
 * Handles API routes pertaining to session user.
 */
@Injectable()
export class UserService implements ApiShow<User> {
  public constructor(private api: BawFormApiService<User>) {}

  public show(): Observable<User> {
    return this.api.show(User, endpoint(emptyParam, emptyParam));
  }

  public confirmPassword(details: ConfirmPassword): Observable<void> {
    return this.api.makeFormRequestWithoutOutput(
      endpoint(confirmationParam, newParam),
      endpoint(confirmationParam, emptyParam),
      (token) => details.getBody(token)
    );
  }

  public resetPassword(details: ResetPassword): Observable<void> {
    return this.api.makeFormRequestWithoutOutput(
      endpoint(passwordParam, newParam),
      endpoint(passwordParam, emptyParam),
      (token) => details.getBody(token)
    );
  }

  public unlockAccount(details: UnlockAccount): Observable<void> {
    return this.api.makeFormRequestWithoutOutput(
      endpoint(unlockParam, newParam),
      endpoint(unlockParam, emptyParam),
      (token) => details.getBody(token)
    );
  }
}

export const userResolvers = new ShowResolver<User, []>([UserService]).create(
  "User"
);
