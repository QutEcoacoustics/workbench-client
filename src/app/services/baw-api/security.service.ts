import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ObservableInput, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { AbstractModel } from "src/app/models/AbstractModel";
import { SessionUser } from "src/app/models/User";
import { API_ROOT } from "../app-config/app-config.service";
import { ApiErrorDetails } from "./api.interceptor.service";
import { BawApiService } from "./baw-api.service";

const registerEndpoint = stringTemplate`/security/`;
const signInEndpoint = stringTemplate`/security/`;
const signOutEndpoint = stringTemplate`/security/`;

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService<SessionUser> {
  private authTrigger = new BehaviorSubject(null);
  private handleError: (err: ApiErrorDetails) => ObservableInput<any>;

  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, SessionUser);

    this.authTrigger.next(this.isLoggedIn());
    this.handleError = (err: ApiErrorDetails) => {
      this.clearSessionUser();
      this.authTrigger.next(null);
      return throwError(err);
    };
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getAuthTrigger(): BehaviorSubject<boolean> {
    return this.authTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  public register(details: any): Observable<SessionUser> {
    return this.apiCreate(registerEndpoint(), details).pipe(
      map(user => {
        this.setSessionUser(user);
        this.authTrigger.next(null);
        return user;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in.
   * @param details Details provided by login form
   */
  public signIn(details: LoginDetails): Observable<SessionUser> {
    return this.apiCreate(signInEndpoint(), details).pipe(
      map((user: SessionUser) => {
        this.setSessionUser(user);
        this.authTrigger.next(null);
        return user;
      }),
      catchError(this.handleError)
    );
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
}
