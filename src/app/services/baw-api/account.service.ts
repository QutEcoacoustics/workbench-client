import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { User } from "src/app/models/User";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const userId: IdParamOptional<User> = id;
const endpoint = stringTemplate`/user_accounts/${userId}${option}`;

/**
 * Account Service.
 * Handles API routes pertaining to user accounts.
 */
@Injectable()
export class AccountService extends StandardApi<User, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, User);
  }

  list(): Observable<User[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<User[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<User>): Observable<User> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: User): Observable<User> {
    return this.apiCreate(endpoint(model, Empty), model);
  }
  update(model: User): Observable<User> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<User>): Observable<User | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const accountResolvers = new Resolvers<User, AccountService>(
  [AccountService],
  "accountId"
).create("Account");
