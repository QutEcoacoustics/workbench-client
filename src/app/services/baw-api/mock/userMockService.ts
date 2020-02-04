import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "src/app/models/User";
import { AppConfigService } from "../../app-config/app-config.service";
import { ShowApi } from "../api-common";

@Injectable({
  providedIn: "root"
})
export class MockUserService extends ShowApi<User, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, User);
  }
  show() {
    return new Observable<User>();
  }
}
