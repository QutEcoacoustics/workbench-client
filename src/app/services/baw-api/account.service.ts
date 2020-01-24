import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { ID } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiShow } from "./api-common";

@Injectable({
  providedIn: "root"
})
export class AccountService extends ApiShow<User> {
  constructor(http: HttpClient, config: AppConfigService) {
    const id = (x: ID) => x;
    super(
      http,
      config,
      stringTemplate`/user_accounts`,
      stringTemplate`/user_accounts/${id}`,
      User
    );
  }

  public show: (userId: ID) => Subject<User>;
}
