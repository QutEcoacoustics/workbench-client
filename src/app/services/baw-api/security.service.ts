import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { retry } from "rxjs/operators";
import { User } from "src/app/interfaces/layout-menus.interfaces";
import { BawApiService, ErrorResponse, Paths } from "./base-api.service";

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService {
  protected paths: Paths;
  protected loggedInTrigger = new BehaviorSubject<boolean>(false);

  constructor(http: HttpClient) {
    super(http);

    this.loggedInTrigger.next(!!this.getSessionToken());

    this.paths = {
      security: {
        ping: "/security",
        signIn: "/security",
        signOut: "/security"
      }
    };
  }

  /**
   * Returns an observable which tracks the change in loggedIn status
   */
  getLoggedInTrigger(): BehaviorSubject<boolean> {
    return this.loggedInTrigger;
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in. Details are retrieved directly from the
   * login form template so that changes to the api are reflected
   * here without update.
   * @param details Details provided by login form
   * @returns Observable (true if success, error string if failure)
   */
  login(details: any): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();

    if (this.isLoggedIn()) {
      subject.next("User already logged in");
    }

    this.http
      .post<AuthenticationLogin>(
        this.getPath(this.paths.security.signIn),
        details,
        this.getHeaderOptions()
      )
      .pipe(retry(0))
      .subscribe(
        data => {
          if (data.meta.status === this.RETURN_CODE.SUCCESS) {
            this.setSessionToken(data.data.auth_token);

            // TODO Read id and role from api
            this.setSessionUser({
              id: 12345,
              role: "User",
              username: data.data.user_name
            });

            // Trigger login trackers
            this.loggedInTrigger.next(true);
            subject.next(true);
          } else {
            console.error("Unknown error thrown by login rest api");
            console.error(data);
            subject.next(
              "An unknown error has occurred. Please refresh the browser or try again at a later date."
            );

            // Trigger login trackers
            this.loggedInTrigger.next(false);
          }
        },
        error => {
          const data: ErrorResponse = error.error;
          if (data.meta.error.details) {
            subject.next(data.meta.error.details);
          } else {
            console.error("Unknown error thrown by login rest api");
            console.error(error);
            subject.next(
              "An unknown error has occurred. Please refresh the browser or try again at a later date."
            );
          }

          // Trigger login trackers
          this.loggedInTrigger.next(false);
        }
      );

    return subject.asObservable();
  }

  /**
   * Logout user and clear session storage values
   */
  logout() {
    if (!this.isLoggedIn()) {
      return;
    }

    this.clearSessionStorage();

    // Trigger login trackers
    this.loggedInTrigger.next(false);
  }

  /**
   * Add user token to the session storage
   * @param token User token
   */
  private setSessionToken(token: string) {
    sessionStorage.setItem(this.SESSION_STORAGE.authToken, token);
  }

  /**
   * Add user details to the session storage
   * @param user User details
   */
  private setSessionUser(user: User) {
    for (const key in user) {
      sessionStorage.setItem(this.SESSION_STORAGE[key], user[key]);
    }
  }

  /**
   * Clear session storage
   */
  private clearSessionStorage() {
    for (const key in this.SESSION_STORAGE) {
      sessionStorage.removeItem(this.SESSION_STORAGE[key]);
    }
  }
}

/**
 * Login interface
 */
interface AuthenticationLogin {
  meta: {
    message: string;
    status: number;
  };
  data: {
    auth_token: string;
    message: string;
    user_name: string;
  };
}
