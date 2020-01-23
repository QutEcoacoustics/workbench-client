import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { SessionUser, SessionUserInterface } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Path } from "./base-api.service";

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService {
  private paths: {
    [key: string]: Path;
  };
  private loggedInTrigger = new BehaviorSubject(null);

  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);

    this.loggedInTrigger.next(this.isLoggedIn());
    this.paths = {
      register: this.makeTemplate`/security`,
      signIn: this.makeTemplate`/security`,
      signOut: this.makeTemplate`/security`
    };
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getLoggedInTrigger(): BehaviorSubject<boolean> {
    return this.loggedInTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  public register(details: any): Subject<boolean> {
    return this.authenticateUser(this.paths.register(), details);
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in.
   * @param details Details provided by login form
   */
  public signIn(details: {
    login: string;
    password: string;
  }): Subject<boolean> {
    return this.authenticateUser(this.paths.signIn(), details);
  }

  /**
   * Logout user and clear session storage values
   */
  public signOut() {
    const subject = new Subject<any>();

    if (!this.isLoggedIn()) {
      this.clearSessionStorage();
      this.loggedInTrigger.next(null);
      subject.complete();
      return;
    }

    const next = () => {
      this.clearSessionStorage();
      this.loggedInTrigger.next(null);
      subject.complete();
    };
    const error = (err: APIErrorDetails) => {
      console.error("Unknown error thrown: ", err);
      subject.error(err);
    };

    this.apiRequest("DELETE", next, error, this.paths.signOut());

    return subject;
  }

  /**
   * Authenticate a user
   * @param path API Route
   * @param details Form details to pass to API
   */
  private authenticateUser(
    path: string,
    details: { login: string; password: string }
  ): Subject<boolean> {
    const subject = new Subject<boolean>();
    const next = (data: SessionUserInterface) => {
      const user = new SessionUser({
        authToken: data.authToken,
        userName: data.userName
      });

      this.setSessionUser(user);
      this.loggedInTrigger.next(null);
      subject.next(true);
    };
    const error = (err: APIErrorDetails) => {
      this.clearSessionStorage();
      this.loggedInTrigger.next(null);
      subject.error(err);
    };

    this.apiRequest("CREATE", next, error, path, details);

    return subject;
  }

  /**
   * Add user details to the session storage
   * @param user User details
   */
  private setSessionUser(user: SessionUser) {
    sessionStorage.setItem(this.userSessionStorage, JSON.stringify(user));
  }

  /**
   * Clear session storage
   */
  private clearSessionStorage() {
    sessionStorage.removeItem(this.userSessionStorage);
  }
}
