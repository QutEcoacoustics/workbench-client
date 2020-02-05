import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiShow, IdOr } from "./api-common";
import { BawApiService } from "./base-api.service";

const endpoint = stringTemplate`/my_account`;

@Injectable({
  providedIn: "root"
})
export class UserService extends BawApiService<User>
  implements ApiShow<User, [], IdOr<User>> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, User);
  }

  show(): Observable<User> {
    return this.apiShow(endpoint());
  }
}
