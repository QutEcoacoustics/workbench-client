import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User } from "src/app/models/User";
import { BawApiService, Paths } from "./base-api.service";

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
  login(details: any): Observable<boolean | string> {
    return this.authenticateUser(this.paths.signIn, details);
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

    this.post<AuthenticationLogin>(path, undefined, details).subscribe(
      (data: AuthenticationLogin) => {
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
interface AuthenticationLogin {
  meta: {
    message: string;
    status: number;
  };
  data: {
    authToken: string;
    message: string;
    userName: string;
  };
}
