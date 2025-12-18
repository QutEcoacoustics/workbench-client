import { Injectable } from "@angular/core";
import { emptyParam, param } from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import {
  BawFormApiService,
  RecaptchaSettings,
} from "@baw-api/baw-form-api.service";
import { BawSessionService } from "@baw-api/baw-session.service";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AuthToken } from "@interfaces/apiInterfaces";
import { LoginDetails } from "@models/data/LoginDetails";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { Session, User } from "@models/User";
import { UNAUTHORIZED } from "http-status";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable } from "rxjs";
import {
  catchError,
  first,
  map,
  mergeMap,
  switchMap,
  tap,
} from "rxjs/operators";
import { NgHttpCachingService } from "ng-http-caching";
import { UserService } from "../user/user.service";

const signUpParam = "sign_up";
const signInParam = "sign_in";

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
    private session: BawSessionService,
    private httpCache: NgHttpCachingService
  ) {
    this.updateAuthToken();
  }

  /**
    * A behavior subject that will complete once the security service has
    * performed an initial check to see if the user is logged in.
    * The value of this behavior subject is a boolean indicating if this
    * initial fetch has been previously completed.
    */
  public firstAuthAwait = new BehaviorSubject(false);

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
      return match?.length === 3 ? [match[1], match[2]] : undefined;
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
    return (
      this.api
        // Sign out without notification so that signUp and signIn endpoints
        // don't show failure notifications
        .destroy(signOutEndpoint(), { disableNotification: true })
        .pipe(
          tap(() => this.clearData()),
          catchError((err: BawApiError) => {
            this.clearData();
            return this.api.handleError(err, true);
          })
        )
    );
  }

  /** Get details of currently logged in user */
  public sessionDetails(): Observable<Session> {
    return this.api.show(Session, sessionUserEndpoint(Date.now().toString()), {
      // This is used when we are unsure if the user is logged in, no need to
      // show an error as it generally is an expected outcome
      disableNotification: true,
    });
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
        switchMap(() => this.sessionDetails()),
        // Only accept the first result from the API (can return multiple times)
        first(),
        // Save to local storage
        tap((user: Session) => (authToken = user.authToken)),
        // Get user details
        switchMap(() => this.userService.showWithoutNotification()),
        // Only accept the first result from the API (can return multiple times)
        first(),
        // Update session user with user details and save to local storage
        tap((user: User) => this.session.setLoggedInUser(user, authToken)),
        // Void output
        map(() => {}),
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

  private updateAuthToken() {
    // Update authToken using cookie if exists
    let authToken: AuthToken;
    this.sessionDetails()
      .pipe(
        tap((user) => (authToken = user.authToken)),
        mergeMap(() => this.userService.showWithoutNotification()),
        first()
      )
      .subscribe({
        next: (user) => {
          this.session.setLoggedInUser(user, authToken);
          this.completeAuthAwait();
        },
        error: () => {
          this.clearData();
          this.completeAuthAwait();
        },
      });
  }

  /**
   * Clear session and cookie data
   */
  private clearData(): void {
    // we clear the http cache when changing the authentication state so that
    // the user doesn't see stale data from the previous user
    this.httpCache.clearCache();

    this.session.clearLoggedInUser();
    this.cookies.deleteAll();
  }

  private completeAuthAwait(): void {
    // Because the boolean value stored in the firstAuthAwait behavior subject
    // indicates if the first auth has been completed previously, we have to
    // emit a value before completing the behavior subject.
    this.firstAuthAwait.next(true);
    this.firstAuthAwait.complete();
  }
}
