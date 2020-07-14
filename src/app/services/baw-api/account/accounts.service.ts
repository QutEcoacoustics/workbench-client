import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IUser, User } from "@models/User";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
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
    return this.apiShow(endpoint(model, Empty));
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
