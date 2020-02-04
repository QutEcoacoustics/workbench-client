import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/models/User";
import { AppConfigService } from "../../app-config/app-config.service";
import { StandardApi } from "../api-common";

@Injectable({
  providedIn: "root"
})
export class AccountService extends StandardApi<User, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, User);
  }

  public list() {
    return new Observable<User[]>();
  }

  public filter() {
    return new Observable<User[]>();
  }

  public show() {
    return new Observable<User>();
  }

  public create() {
    return new Observable<User>();
  }

  public update() {
    return new Observable<User>();
  }

  public destroy() {
    return new Observable<null>();
  }
}
