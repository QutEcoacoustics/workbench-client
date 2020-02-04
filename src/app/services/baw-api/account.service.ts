import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./base-api.service";

const userId: IdParamOptional<User> = id;
const endpoint = stringTemplate`/user_accounts/${userId}${option}`;

@Injectable({
  providedIn: "root"
})
export class AccountService extends StandardApi<User, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, User);
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
  destroy(model: IdOr<User>): Observable<null> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}
