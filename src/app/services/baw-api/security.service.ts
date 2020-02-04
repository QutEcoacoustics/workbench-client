import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { BawApiService } from "./base-api.service";

const registerEndpoint = stringTemplate`/security`;
const signInEndpoint = stringTemplate`/security`;
const signOutEndpoint = stringTemplate`/security`;

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService<SessionUser> {
  private loggedInTrigger = new BehaviorSubject(null);

  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, SessionUser);

    this.loggedInTrigger.next(this.isLoggedIn());
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getLoggedInTrigger(): BehaviorSubject<boolean> {
    return this.loggedInTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  public register(details: any): Observable<SessionUser> {
    return this.apiCreate(registerEndpoint(), details).pipe(
      map(user => {
        this.setSessionUser(user);
        this.loggedInTrigger.next(null);
        return user;
      }),
      catchError(err => {
        this.clearSessionUser();
        this.loggedInTrigger.next(null);
        return throwError(err);
      })
    );
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in.
   * @param details Details provided by login form
   */
  public signIn(details: {
    login: string;
    password: string;
  }): Observable<SessionUser> {
    return this.apiCreate(signInEndpoint(), details).pipe(
      map(user => {
        this.setSessionUser(user);
        this.loggedInTrigger.next(null);
        return user;
      }),
      catchError(err => {
        this.clearSessionUser();
        this.loggedInTrigger.next(null);
        return throwError(err);
      })
    );
  }

  /**
   * Logout user and clear session storage values
   */
  public signOut(): Observable<void> {
    return this.httpDelete(signOutEndpoint()).pipe(
      map(() => {
        this.clearSessionUser();
        this.loggedInTrigger.next(null);
      }),
      catchError(err => {
        this.clearSessionUser();
        this.loggedInTrigger.next(null);
        return throwError(err);
      })
    );
  }
}
