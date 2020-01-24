import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiShow } from "./api-common";

@Injectable({
  providedIn: "root"
})
export class UserService extends ApiShow<User> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(
      http,
      config,
      stringTemplate`/my_account`,
      stringTemplate`/my_account`,
      User
    );
  }

  public show: () => Subject<User>;
}
