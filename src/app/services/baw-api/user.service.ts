import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { User } from "src/app/models/User";
import { ApiShow, IdOr } from "./api-common";
import { BawApiService } from "./baw-api.service";
import { ShowResolver } from "./resolver-common";

const endpoint = stringTemplate`/my_account`;

@Injectable()
export class UserService extends BawApiService<User>
  implements ApiShow<User, [], IdOr<User>> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, User);
  }

  show(): Observable<User> {
    return this.apiShow(endpoint());
  }
}

@Injectable({
  providedIn: "root"
})
export class UserResolver extends ShowResolver<User, UserService> {
  constructor(api: UserService) {
    super(api);
  }
}
