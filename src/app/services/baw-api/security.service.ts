import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "src/app/models/User";
import { APIResponse, BawApiService, Paths } from "./base-api.service";

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

    this.loggedInTrigger.next(this.isLoggedIn());

    this.loggedInTrigger.subscribe({
      next: () => {
        "LoggedInTrigger Update";
      }
    });

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
   */
  getDetails(
    subject: Subject<any>,
    callback: (data: any) => any,
    path: string,
    args?: any
  ) {
    this.loggedInTrigger.subscribe({
      next: () => super.getDetails(subject, callback, path, args),
      error: err => subject.error(err)
    });
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  register(details: any): Observable<boolean | string> {
    return this.authenticateUser(this.paths.register, details);
  }

  /**
   * Login the user, this function can only be called if user
   * is not logged in. Details are retrieved directly from the
   * login form template so that changes to the api are reflected
   * here without update.
   * @param details Details provided by login form
   * @returns Observable (true if success, error string if failure)
   */
  signIn(details: any): Observable<boolean | string> {
    return this.authenticateUser(this.paths.signIn, details);
  }

  /**
   * Logout user and clear session storage values
   */
  signOut() {
    if (!this.isLoggedIn()) {
      this.loggedInTrigger.next(false);
      return;
    }

    this.delete(this.paths.signOut).subscribe({
      next: (data: APIResponse) => {
        if (data.meta.status === this.RETURN_CODE.SUCCESS) {
          this.loggedInTrigger.next(false);
          this.clearSessionStorage();
        } else {
          console.error("Unknown error thrown by login rest api");
          console.error(data);
        }
      },
      error: err => {
        console.error("Unknown error thrown by login rest api");
        console.error(err);
      }
    });
  }

  /**
   * Authenticate a user
   * @param path API Route
   * @param details Form details to pass to API
   */
  private authenticateUser(
    path: string,
    details: { email: string; password: string }
  ): Observable<boolean | string> {
    const subject = new Subject<boolean>();

    // Return early if logged in
    if (this.isLoggedIn()) {
      this.loggedInTrigger.next(true);
      subject.error("You are already logged in, try logging out first.");
      return subject.asObservable();
    }

    this.post<AuthenticationResponse>(path, undefined, details).subscribe(
      (data: AuthenticationResponse) => {
        if (data.meta.status === this.RETURN_CODE.SUCCESS) {
          // TODO Read id and role from api
          this.setSessionUser({
            id: 12345,
            role: "User",
            authToken: data.data.authToken,
            username: data.data.userName
          });

          // Trigger login trackers
          this.loggedInTrigger.next(true);
          subject.next(true);
        } else {
          console.error("Unknown error thrown by login rest api");
          console.error(data);
          this.loggedInTrigger.next(false);
          subject.error("Something bad happened; please try again later.");
        }
      },
      (err: string) => {
        console.error(err);
        this.loggedInTrigger.next(false);
        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  /**
   * Add user details to the session storage
   * @param user User details
   */
  private setSessionUser(user: User) {
    sessionStorage.setItem(this.SESSION_STORAGE.user, JSON.stringify(user));
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
interface Authentication {
  authToken: string;
  message: string;
  userName: string;
}

interface AuthenticationResponse extends APIResponse {
  data: Authentication;
}
