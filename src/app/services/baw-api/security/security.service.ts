import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { param } from "@baw-api/api-common";
import { BawFormApiService } from "@baw-api/baw-form-api.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { LoginDetails } from "@models/data/LoginDetails";
import { RegisterDetails } from "@models/data/RegisterDetails";
import { SessionUser, User } from "@models/User";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { ApiErrorDetails } from "../api.interceptor.service";
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
export class SecurityService extends BawFormApiService<SessionUser> {
  private authTrigger = new BehaviorSubject<void>(null);

  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    private userService: UserService,
    private cookies: CookieService,
    injector: Injector
  ) {
    super(http, apiRoot, SessionUser, injector);

    // After constructor so that we can access super
    this.handleError = (err: ApiErrorDetails | Error): Observable<never> => {
      this.clearData();
      return super.handleError(err);
    };
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getAuthTrigger(): BehaviorSubject<void> {
    return this.authTrigger;
  }

  /**
   * Returns the recaptcha seed for the registration form
   */
  public signUpSeed() {
    return this.getRecaptchaSeed(signUpSeed());
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
    return this.handleAuth(
      signInEndpoint(),
      signInEndpoint(),
      (token: string) => details.getBody(token)
    );
  }

  /**
   * Logout user and clear session storage values
   */
  public signOut(): Observable<void> {
    return this.apiDestroy(signOutEndpoint()).pipe(
      tap(() => this.clearData()),
      catchError(this.handleError)
    ) as Observable<void>;
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
    /*
     * Mimic a traditional form-based sign in/sign up to get a well-formed auth cookie
     * Needed because of:
     * - https://github.com/QutEcoacoustics/baw-server/issues/509
     * - https://github.com/QutEcoacoustics/baw-server/issues/424
     */
    return this.makeFormRequest(formEndpoint, authEndpoint, getFormData).pipe(
      tap((page) => pageValidation(page)),
      // Trade the cookie for an API auth token (mimicking old baw-client)
      mergeMap(() => this.apiShow(sessionUserEndpoint(Date.now().toString()))),
      // Save to local storage
      tap((user: SessionUser) => this.storeLocalUser(user)),
      // Get user details
      mergeMap(() => this.userService.show()),
      // Update session user with user details and save to local storage
      tap((user: User) =>
        this.storeLocalUser(
          new SessionUser({ ...this.getLocalUser(), ...user.toJSON() })
        )
      ),
      // Trigger auth observable
      tap(() => this.authTrigger.next(null)),
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
    this.clearSessionUser();
    this.cookies.deleteAll();
    this.authTrigger.next(null);
  }
}
