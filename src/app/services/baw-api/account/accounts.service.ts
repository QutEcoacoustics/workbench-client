import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IUser, User } from "@models/User";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { apiReturnCodes, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const userId: IdParamOptional<User> = id;
const endpoint = stringTemplate`/user_accounts/${userId}${option}`;

/**
 * Account Service.
 * Handles API routes pertaining to user accounts.
 */
@Injectable()
export class AccountsService extends StandardApi<User> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, User, injector);
  }

  public list(): Observable<User[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  public filter(filters: Filters<IUser>): Observable<User[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  public show(model: IdOr<User>): Observable<User> {
    return this.apiShow(endpoint(model, Empty)).pipe(
      // Return unknown or deleted user depending on error code
      catchError((err: ApiErrorDetails) => {
        switch (err.status) {
          case apiReturnCodes.unauthorized:
            console.warn("Returning Unknown User");
            return of(User.unknownUser);
          case apiReturnCodes.notFound:
            console.warn("Returning Not Found User");
            return of(User.deletedUser);
          default:
            return throwError(err);
        }
      })
    );
  }
  public create(model: User): Observable<User> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  public update(model: User): Observable<User> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  public destroy(model: IdOr<User>): Observable<User | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const accountResolvers = new Resolvers<User, AccountsService>(
  [AccountsService],
  "accountId"
).create("Account");
