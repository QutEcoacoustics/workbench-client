import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { SessionUser, SessionUserInterface } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { APIResponse, apiReturnCodes, BawApiService } from "./base-api.service";

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService {
  private paths: {
    [key: string]: string;
  };
  private loggedInTrigger = new BehaviorSubject(null);

  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);

    this.loggedInTrigger.next(this.isLoggedIn());
    this.paths = {
      register: "/security",
      signIn: "/security",
      signOut: "/security"
    };
  }

  /**
   * Returns an observable which tracks the change in loggedIn status
   */
  public getLoggedInTrigger(): BehaviorSubject<boolean> {
    return this.loggedInTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  public register(details: any): Observable<boolean | string> {
    return this.authenticateUser(this.paths.register, details);
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in.
   * @param details Details provided by login form
   * @returns Observable (true if success, error string if failure)
   */
  public signIn(details: {
    login: string;
    password: string;
  }): Observable<boolean | string> {
    return this.authenticateUser(this.paths.signIn, details);
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

    this.delete(this.paths.signOut).subscribe({
      next: (data: APIResponse) => {
        if (data.meta.status === apiReturnCodes.success) {
          this.clearSessionStorage();
          this.loggedInTrigger.next(null);
          subject.complete();
        } else {
          console.error("Unknown error thrown by login rest api");
          console.error(data);
          subject.error(data);
        }
      },
      error: (err: APIErrorDetails) => {
        console.error("Unknown error thrown by login rest api");
        console.error(err);
        subject.error(err);
      }
    });

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
  ): Observable<boolean | string> {
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

    this.apiCreate(next, error, path, details);

    return subject.asObservable();
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
