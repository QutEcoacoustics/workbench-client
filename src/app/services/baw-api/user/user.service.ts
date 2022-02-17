import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawApiStateService } from "@baw-api/baw-api-state.service";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
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
export class UserService
  extends BawFormApiService<User>
  implements ApiShow<User>
{
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, User, injector, state);
  }

  public show(): Observable<User> {
    return this.apiShow(endpoint(emptyParam, emptyParam));
  }

  public confirmPassword(details: ConfirmPassword): Observable<void> {
    return this.makeFormRequestWithoutOutput(
      endpoint(confirmationParam, newParam),
      endpoint(confirmationParam, emptyParam),
      (token) => details.getBody(token)
    );
  }

  public resetPassword(details: ResetPassword): Observable<void> {
    return this.makeFormRequestWithoutOutput(
      endpoint(passwordParam, newParam),
      endpoint(passwordParam, emptyParam),
      (token) => details.getBody(token)
    );
  }

  public unlockAccount(details: UnlockAccount): Observable<void> {
    return this.makeFormRequestWithoutOutput(
      endpoint(unlockParam, newParam),
      endpoint(unlockParam, emptyParam),
      (token) => details.getBody(token)
    );
  }
}

export const userResolvers = new ShowResolver<User, []>([UserService]).create(
  "User"
);
