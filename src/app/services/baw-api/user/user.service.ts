import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { User } from "@models/User";
import { Observable } from "rxjs";
import { ApiShow, IdOr } from "../api-common";
import { BawApiService } from "../baw-api.service";
import { ShowResolver } from "../resolver-common";

const endpoint = stringTemplate`/my_account/`;

/**
 * User Service.
 * Handles API routes pertaining to session user.
 */
@Injectable()
export class UserService
  extends BawApiService<User>
  implements ApiShow<User, [], IdOr<User>> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, User, injector);
  }

  public show(): Observable<User> {
    return this.apiShow(endpoint());
  }
}

export const userResolvers = new ShowResolver<User, UserService>([
  UserService,
]).create("User");
