import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, throwError } from "rxjs";
import { User } from "src/app/interfaces/layout-menus.interfaces";

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export class BawApiService {
  constructor(protected http: HttpClient) {
    const authToken = sessionStorage.getItem(this.SESSION_STORAGE.auth_token);
    const userName = sessionStorage.getItem(this.SESSION_STORAGE.user_name);

    // TODO Read this from the session cookie provided by ruby
    if (authToken && userName) {
      this.authToken = authToken;
      this._username = userName;
    }
  }

  private url = "https://staging.ecosounds.org";
  protected authToken: string;
  protected _username: string;
  protected httpOptions = {
    headers: new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json"
    })
  };

  protected RETURN_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401
  };
  protected SESSION_STORAGE = {
    auth_token: "auth_token",
    user_name: "user_name"
  };

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
   * Returns the path for the api route
   * @param path Path fragment
   */
  getPath(path: string) {
    return this.url + path;
  }

  /**
   * Writes error to console and throws error
   * @param error HTTP Error
   * @throws Observable<never>
   */
  protected handleError(error: HttpErrorResponse): Observable<string> {
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

export interface ErrorResponse {
  meta: {
    status: number;
    message: string;
    error: {
      details: string;
    };
  };
}

export interface Paths {
  [key: string]: {
    [key: string]: string;
  };
}
