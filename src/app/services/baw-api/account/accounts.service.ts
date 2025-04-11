import { Inject, Injectable } from "@angular/core";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { User } from "@models/User";
import httpCodes from "http-status";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id, UserConcent } from "@interfaces/apiInterfaces";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const userId: IdParamOptional<User> = id;
const endpoint = stringTemplate`/user_accounts/${userId}${option}`;

/**
 * Account Service.
 * Handles API routes pertaining to user accounts.
 */
@Injectable()
export class AccountsService implements StandardApi<User> {
  public constructor(
    private api: BawApiService<User>,
    @Inject(ASSOCIATION_INJECTOR) private injector: AssociationInjector,
  ) {}

  public list(): Observable<User[]> {
    return this.api.list(User, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<User>): Observable<User[]> {
    return this.api.filter(User, endpoint(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<User>): Observable<User> {
    return this.api.show(User, endpoint(model, emptyParam)).pipe(
      // Return unknown or deleted user depending on error code
      catchError((err: BawApiError) => {
        switch (err.status) {
          case httpCodes.UNAUTHORIZED:
            // Return unknown user, this only occurs when user is anonymous to the logged in/guest user
            return of(User.getUnknownUser(this.injector));
          case httpCodes.NOT_FOUND:
            // Return deleted user, this only occurs when a user is soft-deleted
            return of(User.getDeletedUser(this.injector));
          default:
            return throwError(() => err);
        }
      })
    );
  }

  public create(model: User): Observable<User> {
    return this.api.create(
      User,
      endpoint(emptyParam, emptyParam),
      (user) => endpoint(user, emptyParam),
      model
    );
  }

  public update(model: User): Observable<User> {
    return this.api.update(User, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<User>): Observable<User | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  public optInContactable(targetUserId: Id): Observable<User> {
    return this.updateContactableConcent(targetUserId, UserConcent.yes);
  }

  public optOutContactable(targetUserId: Id): Observable<User> {
    return this.updateContactableConcent(targetUserId, UserConcent.no);
  }

  public updateContactableConcent(targetUserId: Id, contactable: UserConcent): Observable<User> {
    return this.update(new User({ id: targetUserId, contactable }));
  }
}

export const accountResolvers = new Resolvers<User, []>(
  [AccountsService],
  "accountId"
).create("Account");
