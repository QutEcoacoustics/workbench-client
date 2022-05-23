import { Injectable } from "@angular/core";
import { emptyParam, param } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import {
  BawFormApiService,
  RecaptchaSettings,
} from "@baw-api/baw-form-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AuthToken } from "@interfaces/apiInterfaces";
import { LoginDetails } from "@models/data/LoginDetails";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { Session, User } from "@models/User";
import { UNAUTHORIZED } from "http-status";
import { CookieService } from "ngx-cookie-service";
import { Observable, throwError } from "rxjs";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { UserService } from "../user/user.service";

const signUpParam = "sign_up" as const;
const signInParam = "sign_in" as const;

const accountEndpoint = stringTemplate`/my_account/${param}`;
const signOutEndpoint = stringTemplate`/security/`;
const sessionUserEndpoint = stringTemplate`/security/user?antiCache=${param}`;

/**
 * Security Service.
 * Handles API routes pertaining to security.
 */
@Injectable()
export class SecurityService {
  public constructor(
    private api: BawApiService<Session>,
    private formApi: BawFormApiService<Session>,
    private userService: UserService,
    private cookies: CookieService,
    private session: BawSessionService
  ) {
    this.updateAuthToken();
  }

  /**
   * Returns the recaptcha seed for the registration form
   */
  public signUpSeed(): Observable<RecaptchaSettings> {
    return this.formApi.getRecaptchaSeed(accountEndpoint(signUpParam));
  }

  /**
   * Sign up the user
   *
   * @param details Details provided by registration form
   */
  public signUp(details: RegisterDetails): Observable<void> {
    /** Extract page error data from page response */
    const getPageError = (page: string): [string, string] => {
      const pageError = / id="(.+)" \/><span class="help-block">(.+)<\/span>/;
      const match = page.match(pageError);
      return match.length === 3 ? [match[1], match[2]] : undefined;
    };

    /** Read page response for unique username error */
    const validateUniqueUsername = ([type, msg]: [string, string]): void => {
      if (type === "user_user_name" && msg === "has already been taken") {
        throw Error("Username has already been taken");
      }
    };

    /** Read page response for username constraints */
    const validateUsernameConstraints = ([type, msg]: [
      string,
      string
    ]): void => {
      if (type === "user_user_name" && msg.includes("Only letters, numbers")) {
        throw Error(
          "Username can only include letters, numbers, spaces ( ), underscores (_) and dashes (-)"
        );
      }
    };

    /** Read page response for unique email error */
    const validateUniqueEmail = ([type, msg]: [string, string]): void => {
      if (type === "user_email" && msg === "has already been taken") {
        throw Error("Email address has already been taken");
      }
    };

    return this.handleAuth(
      accountEndpoint(signUpParam),
      accountEndpoint(emptyParam),
      (token: string) => details.getBody(token),
      (page): void => {
        const pageError = getPageError(page);
        if (!pageError) {
          return;
        }
        validateUniqueUsername(pageError);
        validateUniqueEmail(pageError);
        validateUsernameConstraints(pageError);
      }
    );
  }

  /**
   * Login the user
   *
   * @param details Details provided by login form
   */
  public signIn(details: LoginDetails): Observable<void> {
    const validateLoggedIn = (page: string) => {
      const successMsg = "Logged in successfully";
      if (!page.includes(successMsg)) {
        throw Error("Username or password was incorrect.");
      }
    };

    const handleAuth = this.handleAuth(
      accountEndpoint(signInParam),
      accountEndpoint(signInParam),
      (token: string) => details.getBody(token),
      (page) => {
        validateLoggedIn(page);
      }
    );

    // Logout first to ensure token and cookie are synchronized
    return this.signOut().pipe(
      mergeMap(() => handleAuth),
      // Ignore any sign out errors, and continue with authentication
      catchError(() => handleAuth)
    );
  }

  /**
   * Logout user and clear session storage values
   */
  public signOut(): Observable<void> {
    return this.api.destroy(signOutEndpoint()).pipe(
      tap(() => this.clearData()),
      catchError((err) => {
        this.clearData();
        // Don't use handleError function from api service, as it will throw
        // out a notification
        return throwError(() => err);
      })
    ) as Observable<void>;
  }

  /** Get details of currently logged in user */
  public sessionDetails(): Observable<Session> {
    return this.api.show(Session, sessionUserEndpoint(Date.now().toString()));
  }

  /**
   * Handle authentication request
   *
   * @param formEndpoint Endpoint to retrieve form html
   * @param authEndpoint Endpoint to sign in/sign up user, should set an auth cookie
   * @param getFormData Get form data to insert into api request
   */
  private handleAuth(
    formEndpoint: string,
    authEndpoint: string,
    getFormData: (authToken: string) => URLSearchParams,
    pageValidation: (page: string) => void = () => {}
  ): Observable<void> {
    let authToken: AuthToken;

    /*
     * Mimic a traditional form-based sign in/sign up to get a well-formed auth cookie
     * Needed because of:
     * - https://github.com/QutEcoacoustics/baw-server/issues/509
     * - https://github.com/QutEcoacoustics/baw-server/issues/424
     */
    return this.formApi
      .makeFormRequest(formEndpoint, authEndpoint, getFormData)
      .pipe(
        tap((page) => pageValidation(page)),
        // Trade the cookie for an API auth token (mimicking old baw-client)
        mergeMap(() => this.sessionDetails()),
        // Save to local storage
        tap((user: Session) => (authToken = user.authToken)),
        // Get user details
        mergeMap(() => this.userService.show()),
        // Update session user with user details and save to local storage
        tap((user: User) => this.session.setLoggedInUser(user, authToken)),
        // Void output
        map(() => undefined),
        // Complete observable
        first(),
        catchError((err) => {
          this.clearData();

          if (err.status === UNAUTHORIZED) {
            const msg = `An unknown error has occurred, if this persists please use the ${reportProblemMenuItem.label} page`;
            return this.formApi.handleError(Error(msg));
          } else {
            return this.formApi.handleError(err);
          }
        })
      );
  }

  private updateAuthToken(): void {
    // Update authToken using cookie if exists
    let authToken: AuthToken;
    this.sessionDetails()
      .pipe(
        tap((user) => (authToken = user.authToken)),
        mergeMap(() => this.userService.show()),
        first()
      )
      .subscribe({
        next: (user) => {
          this.session.setLoggedInUser(user, authToken);
        },
        error: () => {
          this.clearData();
        },
      });
  }

  /**
   * Clear session and cookie data, then trigger authTrigger
   */
  private clearData() {
    this.session.clearLoggedInUser();
    this.cookies.deleteAll();
  }
}
