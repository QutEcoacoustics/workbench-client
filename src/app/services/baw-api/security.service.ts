import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { SessionUser, SessionUserInterface } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { APIResponse, BawApiService, Filters } from "./base-api.service";

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService {
  protected loggedInTrigger = new BehaviorSubject<boolean>(false);

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
  getLoggedInTrigger(): BehaviorSubject<boolean> {
    return this.loggedInTrigger;
  }

  /**
   * Get response from details route. Updates on logged in state change
   * @param subject Subject to update
   * @param callback Callback function which generates the model
   * @param path API path
   * @param args API arguments
   * @param filters API parameters
   */
  details(
    subject: Subject<any>,
    callback: (data: any) => any,
    path: string,
    args?: any,
    filters?: Filters
  ) {
    this.loggedInTrigger.subscribe({
      next: () => super.details(subject, callback, path, args, filters),
      error: (err: APIErrorDetails) => subject.error(err)
    });
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  register(details: any): Observable<boolean | string> {
    return this.authenticateUser(this.paths.register, details);
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in.
   * @param details Details provided by login form
   * @returns Observable (true if success, error string if failure)
   */
  signIn(details: {
    login: string;
    password: string;
  }): Observable<boolean | string> {
    return this.authenticateUser(this.paths.signIn, details);
  }

  /**
   * Logout user and clear session storage values
   */
  signOut() {
    const subject = new Subject<any>();

    if (!this.isLoggedIn()) {
      this.clearSessionStorage();
      this.loggedInTrigger.next(false);
      subject.complete();
      return;
    }

    this.delete(this.paths.signOut).subscribe({
      next: (data: APIResponse) => {
        if (data.meta.status === this.apiReturnCodes.success) {
          this.clearSessionStorage();
          this.loggedInTrigger.next(false);
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
    const next = (data: Authentication) => {
      const user = new SessionUser({
        authToken: data.authToken,
        userName: data.userName
      });

      this.setSessionUser(user);
      this.loggedInTrigger.next(true);
      subject.next(true);
    };
    const error = (err: APIErrorDetails) => {
      this.clearSessionStorage();
      this.loggedInTrigger.next(false);
      subject.error(err);
    };

    this.create(next, error, path, undefined, details);

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

/**
 * Login interface
 */
interface Authentication extends SessionUserInterface {
  message: string;
}
