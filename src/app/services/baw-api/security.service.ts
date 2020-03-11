import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ObservableInput, throwError } from "rxjs";
import { catchError, flatMap, map } from "rxjs/operators";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { AbstractModel } from "src/app/models/AbstractModel";
import { SessionUser } from "src/app/models/User";
import { ApiErrorDetails } from "./api.interceptor.service";
import { BawApiService } from "./baw-api.service";
import { UserService } from "./user.service";

const registerEndpoint = stringTemplate`/security/`;
const signInEndpoint = stringTemplate`/security/`;
const signOutEndpoint = stringTemplate`/security/`;

/**
 * Interacts with security based routes in baw api
 */
@Injectable()
export class SecurityService extends BawApiService<SessionUser> {
  private authTrigger = new BehaviorSubject<void>(null);
  private handleError: (err: ApiErrorDetails) => ObservableInput<any>;

  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    private userService: UserService
  ) {
    super(http, apiRoot, SessionUser);

    this.handleError = (err: ApiErrorDetails) => {
      this.clearSessionUser();
      this.authTrigger.next(null);
      return throwError(err);
    };
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getAuthTrigger(): BehaviorSubject<void> {
    return this.authTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  public register(details: any): Observable<void> {
    return this.handleAuth(this.apiCreate(registerEndpoint(), details));
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in.
   * @param details Details provided by login form
   */
  public signIn(details: LoginDetails): Observable<void> {
    return this.handleAuth(this.apiCreate(signInEndpoint(), details));
  }

  /**
   * Logout user and clear session storage values
   */
  public signOut(): Observable<void> {
    return this.apiDestroy(signOutEndpoint()).pipe(
      map(() => {
        this.clearSessionUser();
        this.authTrigger.next(null);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle register/login authentication requests
   * @param apiRequest API Request
   */
  private handleAuth(apiRequest: Observable<SessionUser>): Observable<void> {
    return apiRequest.pipe(
      flatMap((sessionUser: SessionUser) => {
        // Store authToken before making api request
        this.storeLocalUser(sessionUser);

        return this.userService.show().pipe(
          map(user => {
            return new SessionUser({ ...user, ...sessionUser });
          })
        );
      }),
      map((sessionUser: SessionUser) => {
        this.storeLocalUser(sessionUser);
        this.authTrigger.next(null);
      }),
      catchError(this.handleError)
    );
  }
}

export interface LoginDetailsInterface {
  login: string;
  password: string;
}

export class LoginDetails extends AbstractModel
  implements LoginDetailsInterface {
  login: string;
  password: string;

  constructor(details: LoginDetailsInterface) {
    super(details);
  }

  public toJSON(): object {
    return {
      login: this.login,
      password: this.password
    };
  }

  redirectPath(): string {
    throw new Error("Not Implemented");
  }
}
