import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiShow, IdOr } from "./api-common";
import { BawApiService, STUB_API_ROOT } from "./baw-api.service";

const endpoint = stringTemplate`/my_account`;

export const userServiceFactory = (
  http: HttpClient,
  config: AppConfigService
) => {
  return new UserService(http, config.getConfig().environment.apiRoot);
};

@Injectable()
export class UserService extends BawApiService<User>
  implements ApiShow<User, [], IdOr<User>> {
  constructor(http: HttpClient, @Inject(STUB_API_ROOT) apiRoot: string) {
    super(http, apiRoot, User);
  }

  show(): Observable<User> {
    return this.apiShow(endpoint());
  }
}
