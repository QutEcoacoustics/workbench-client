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
  ReadonlyApi
} from "./api-common";
import { Filters } from "./baw-api.service";
import { ListResolver, ShowResolver } from "./resolver-common";

const userId: IdParamOptional<User> = id;
const endpoint = stringTemplate`/user_accounts/${userId}${option}`;

@Injectable()
export class AccountService extends ReadonlyApi<User, []> {
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
}

@Injectable({
  providedIn: "root"
})
export class AccountResolver extends ListResolver<User> {
  constructor(api: AccountService) {
    super(api, () => []);
  }
}

@Injectable({
  providedIn: "root"
})
export class ShallowSiteResolver extends ShowResolver<User> {
  constructor(api: AccountService) {
    super(
      api,
      params => parseInt(params.get("accountId"), 10),
      () => []
    );
  }
}
