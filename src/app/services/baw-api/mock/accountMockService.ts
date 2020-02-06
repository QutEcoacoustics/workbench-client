import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/models/User";
import { AppConfigService } from "../../app-config/app-config.service";
import { ReadonlyApi } from "../api-common";

@Injectable({
  providedIn: "root"
})
export class MockAccountService extends ReadonlyApi<User, []> {
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
}
