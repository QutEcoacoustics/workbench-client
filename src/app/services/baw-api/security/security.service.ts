import { Injectable } from "@angular/core";
import { param } from "@baw-api/api-common";
import { BawSessionService } from "@baw-api/baw-session.service";
import {
  BawFormApiService,
  RecaptchaSettings,
} from "@baw-api/baw-form-api.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AuthToken } from "@interfaces/apiInterfaces";
import { LoginDetails } from "@models/data/LoginDetails";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { Session, User } from "@models/User";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { UserService } from "../user/user.service";

const signUpSeed = stringTemplate`/my_account/sign_up/`;
const signUpEndpoint = stringTemplate`/my_account/`;
const signInEndpoint = stringTemplate`/my_account/sign_in/`;
const signOutEndpoint = stringTemplate`/security/`;
const sessionUserEndpoint = stringTemplate`/security/user?antiCache=${param}`;

/**
 * Security Service.
 * Handles API routes pertaining to security.
 */
@Injectable()
export class SecurityService {
  public constructor(
    private api: BawFormApiService<Session>,
    private userService: UserService,
    private cookies: CookieService,
    private session: BawSessionService
  ) {
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

  public handleError(err: BawApiError | Error): Observable<never> {
    this.clearData();
    return this.api.handleError(err);
  }

  /**
   * Returns the recaptcha seed for the registration form
   */
  public signUpSeed(): Observable<RecaptchaSettings> {
    return this.api.getRecaptchaSeed(signUpSeed());
  }

  /**
   * Sign up the user
   *
   * @param details Details provided by registration form
   */
  public signUp(details: RegisterDetails): Observable<void> {
    // Read page response for unique username error
    const validateUniqueUsername = (page: string) => {
      const errMsg =
        'id="user_user_name" /><span class="help-block">has already been taken';
      if (page.includes(errMsg)) {
        throw Error("Username has already been taken.");
      }
    };

    // Read page response for unique email error
    const validateUniqueEmail = (page: string) => {
      const errMsg =
        'id="user_email" /><span class="help-block">has already been taken';
      if (page.includes(errMsg)) {
        throw Error("Email address has already been taken.");
      }
    };

    return this.handleAuth(
      signUpSeed(),
      signUpEndpoint(),
      (token: string) => details.getBody(token),
      (page) => {
        validateUniqueUsername(page);
        validateUniqueEmail(page);
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
      signInEndpoint(),
      signInEndpoint(),
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
      catchError(this.handleError)
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
    return this.api
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
          return this.handleError(err);
        })
      );
  }

  /**
   * Clear session and cookie data, then trigger authTrigger
   */
  private clearData() {
    this.session.clearLoggedInUser();
    this.cookies.deleteAll();
  }
}
