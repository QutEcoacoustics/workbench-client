import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: 'root'
})
export class BawApiService {
  constructor(private http: HttpClient) {
    const auth_token = sessionStorage.getItem(this.SESSION_STORAGE.auth_token);
    const user_name = sessionStorage.getItem(this.SESSION_STORAGE.user_name);

    if (auth_token && user_name) {
      this._auth_token = auth_token;
      this._user_name = user_name;

      console.debug(this._auth_token);
      console.debug(this._user_name);
    }
  }

  private _auth_token: string;
  private _user_name: string;
  private _bawClientUrl = 'https://staging.ecosounds.org';
  private _httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json'
    })
  };

  private RETURN_CODE = {
    SUCCESS: 200,
    BAD_AUTHENTICATION: 401
  };
  private SESSION_STORAGE = {
    auth_token: 'auth_token',
    user_name: 'user_name'
  };

  /**
   * Get list of projects avaiable to user
   * @returns Observable list of projects
   */
  getProjectList(): Observable<Projects | string> {
    return this.http
      .get<Projects>(this._bawClientUrl + '/projects', this._httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user and clear session storage values
   */
  logout() {
    if (this.loggedIn) {
      return;
    }

    this._auth_token = null;
    this._user_name = null;
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
    if (this._auth_token) {
      subject.next('User already logged in');
    }

    this.http
      .post<AuthenticationLogin>(
        this._bawClientUrl + '/security',
        details,
        this._httpOptions
      )
      .pipe(retry(3))
      .subscribe(
        data => {
          if (data.meta.status === this.RETURN_CODE.SUCCESS) {
            this._auth_token = data.data.auth_token;
            this._user_name = data.data.user_name;
            this._httpOptions = {
              headers: this._httpOptions.headers.append(
                'Authorization',
                `Token token "${this._auth_token}"`
              )
            };
            sessionStorage.setItem(
              this.SESSION_STORAGE.auth_token,
              this._auth_token
            );
            sessionStorage.setItem(
              this.SESSION_STORAGE.user_name,
              this._user_name
            );
            subject.next(true);
          } else {
            console.error('Unknown error thrown by login rest api');
            console.error(data);
            subject.next(false);
          }
        },
        error => {
          if (error.status === this.RETURN_CODE.BAD_AUTHENTICATION) {
            subject.next('Invalid username/email or password.');
          } else {
            console.debug('Unknown error thrown by login rest api');
            console.debug(error);
            subject.next(false);
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
    return !!this._auth_token;
  }

  /**
   * Username of the logged in user
   */
  get user_name() {
    return this._user_name ? this._user_name : 'NOT LOGGED IN';
  }

  /**
   * Writes error to console and throws error
   * @param error HTTP Error
   * @throws Observable<never>
   */
  private handleError(error: HttpErrorResponse): Observable<string> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}

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

export interface Projects {
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
