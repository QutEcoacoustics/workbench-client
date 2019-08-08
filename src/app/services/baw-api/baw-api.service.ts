import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { User } from "src/app/interfaces/layout-menus.interfaces";

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export class BawApiService {
  constructor(private http: HttpClient) {
    const authToken = sessionStorage.getItem(this.SESSION_STORAGE.auth_token);
    const userName = sessionStorage.getItem(this.SESSION_STORAGE.user_name);

    // TODO Read this from the session cookie provided by ruby
    if (authToken && userName) {
      this.authToken = authToken;
      this._username = userName;
    }
  }

  private authToken: string;
  private _username: string;
  private bawClientUrl = "https://staging.ecosounds.org";
  private httpOptions = {
    headers: new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json"
    })
  };

  private RETURN_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401
  };
  private SESSION_STORAGE = {
    auth_token: "auth_token",
    user_name: "user_name"
  };

  /**
   * Get list of projects available to user
   * @returns Observable list of projects
   */
  getProjectList(): Observable<Projects | string> {
    return this.http
      .get<Projects>(this.bawClientUrl + "/projects", this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
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

  /**
   * Login the user, this function can only be called if user
   * is not logged in. Details are retrieved directly from the
   * login form template so that changes to the api are reflected
   * here without update.
   * @param details Details provided by login form
   * @returns Observable
   */
  login(details: {}): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();
    if (this.loggedIn) {
      subject.next("User already logged in");
    }

    this.http
      .post<AuthenticationLogin>(
        this.bawClientUrl + "/security",
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
          if (error.error.meta.error.details) {
            subject.next(error.error.meta.error.details);
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
   * Check if user is logged in
   * TODO Ping API to check token is still valid
   */
  get loggedIn() {
    return !!this.authToken;
  }

  /**
   * Username of the logged in user
   */
  get user(): User {
    return this._username
      ? {
          username: this._username,
          // FIXME:
          id: 123456,
          // FIXME:
          role: "User"
        }
      : null;
  }

  /**
   * Writes error to console and throws error
   * @param error HTTP Error
   * @throws Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<string> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
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

/**
 * Projects interface
 */
interface Projects {
  meta: {
    status: number;
    message: string;
    error?: {
      details: string;
      info: string;
    };
    sorting?: {
      order_by: string;
      direction: string;
    };
    paging?: {
      page: number;
      items: number;
      total: number;
      max_page: number;
      current: string;
      previous: string;
      next: string;
    };
  };
  data: {
    id: number;
    name: string;
    description: string;
    creator_id: number;
    site_ids: number[];
    description_html: string;
  }[];
}
