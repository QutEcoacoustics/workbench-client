import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { retry } from "rxjs/operators";
import { BawApiService, ErrorResponse, Paths } from "./base-api.service";

/**
 * Interacts with security based routes in baw api
 */
@Injectable({
  providedIn: "root"
})
export class SecurityService extends BawApiService {
  protected paths: Paths;

  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      security: {
        ping: "/security",
        signIn: "/security",
        signOut: "/security"
      }
    };
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
    if (this.loggedIn) {
      subject.next("User already logged in");
    }

    this.http
      .post<AuthenticationLogin>(
        this.getPath(this.paths.security.signIn),
        details,
        this.httpOptions
      )
      .pipe(retry(0))
      .subscribe(
        data => {
          if (data.meta.status === this.RETURN_CODE.SUCCESS) {
            this.authToken = data.data.auth_token;
            this._username = data.data.user_name;
            this.httpOptions = {
              headers: this.httpOptions.headers.append(
                "Authorization",
                `Token token="${this.authToken}"`
              )
            };
            sessionStorage.setItem(
              this.SESSION_STORAGE.auth_token,
              this.authToken
            );
            sessionStorage.setItem(
              this.SESSION_STORAGE.user_name,
              this._username
            );
            subject.next(true);
          } else {
            console.error("Unknown error thrown by login rest api");
            console.error(data);
            subject.next(
              "An unknown error has occurred. Please refresh the browser or try again at a later date."
            );
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
        }
      );

    return subject.asObservable();
  }

  /**
   * Logout user and clear session storage values
   */
  logout() {
    if (!this.loggedIn) {
      return;
    }

    this.authToken = null;
    this._username = null;
    sessionStorage.removeItem(this.SESSION_STORAGE.auth_token);
    sessionStorage.removeItem(this.SESSION_STORAGE.user_name);
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
