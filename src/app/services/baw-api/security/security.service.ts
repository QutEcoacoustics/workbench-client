import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { param } from "@baw-api/api-common";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AbstractModel } from "@models/AbstractModel";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { SessionUser, User } from "@models/User";
import { BehaviorSubject, Observable, ObservableInput, throwError } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { ApiErrorDetails } from "../api.interceptor.service";
import { apiReturnCodes, BawApiService } from "../baw-api.service";
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
export class SecurityService extends BawApiService<SessionUser> {
  private authTrigger = new BehaviorSubject<void>(null);
  private handleError = (
    err: ApiErrorDetails | Error
  ): ObservableInput<any> => {
    this.clearSessionUser();
    this.authTrigger.next(null);

    if (err instanceof Error) {
      return throwError({
        status: apiReturnCodes.unknown,
        message: err.message,
      } as ApiErrorDetails);
    }
    return throwError(err);
  };

  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    private userService: UserService,
    injector: Injector
  ) {
    super(http, apiRoot, SessionUser, injector);
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getAuthTrigger(): BehaviorSubject<void> {
    return this.authTrigger;
  }

  public signUpSeed(): Observable<string> {
    return this.http
      .get(this.getPath(signUpSeed()), { responseType: "text" })
      .pipe(
        map((page: string) => {
          const errMsg =
            "Unable to retrieve recaptcha seed for registration request";

          // Catch wrong type of response
          if (typeof page !== "string") {
            throw new Error(errMsg);
          }

          const token = page.match(
            /id="g-recaptcha-response-data-register" data-sitekey="(.+?)"/
          );
          if (!isInstantiated(token?.[1])) {
            throw new Error(errMsg);
          }

          return token[1];
        }),
        // Handle errors
        catchError(this.handleError)
      );
  }

  /**
   * Register the user
   *
   * @param details Details provided by registration form
   */
  public signUp(details: RegisterDetails): Observable<void> {
    function setFormData(page: any, body: URLSearchParams) {
      const errMsg =
        "Unable to retrieve authenticity token for registration request";

      // Catch wrong type of response
      if (typeof page !== "string") {
        throw new Error(errMsg);
      }

      // Extract auth token if exists
      const token = page.match(/name="authenticity_token" value="(.+?)"/);
      if (!isInstantiated(token?.[1])) {
        throw new Error(errMsg);
      }

      // Set form data
      body.set("user[user_name]", details.userName);
      body.set("user[email]", details.email);
      body.set("user[password]", details.password);
      body.set("user[password_confirmation]", details.passwordConfirmation);
      body.set("commit", "Register");
      body.set("authenticity_token", token[1]);
      body.set("g-recaptcha-response-data[register]", details.recaptchaToken);
      body.set("g-recaptcha-response", "");
    }

    const formData = new URLSearchParams();

    return this.http
      .get(this.getPath(signUpSeed()), { responseType: "text" })
      .pipe(
        // Extract form data from register form
        tap((page: string) => setFormData(page, formData)),
        // Mimic a traditional form-based sign up
        // Needed because of https://github.com/QutEcoacoustics/baw-server/issues/424
        mergeMap(() => this.signUpWithFormData(formData)),
        // Trade the cookie for an API auth token (mimicking old baw-client)
        mergeMap(() =>
          this.apiShow(sessionUserEndpoint(Date.now().toString()))
        ),
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
        // Handle errors
        catchError(this.handleError)
      );
  }

  /**
   * Login the user
   *
   * @param details Details provided by login form
   */
  public signIn(details: LoginDetails): Observable<void> {
    function setFormData(page: any, body: URLSearchParams) {
      const errMsg = "Unable to retrieve authenticity token for login request";

      // Catch wrong type of response
      if (typeof page !== "string") {
        throw new Error(errMsg);
      }

      // Extract auth token if exists
      const token = page.match(/name="authenticity_token" value="(.+?)"/);
      if (!isInstantiated(token?.[1])) {
        throw new Error(errMsg);
      }

      // Set form data
      body.set("user[login]", details.login);
      body.set("user[password]", details.password);
      body.set("user[remember_me]", "0");
      body.set("commit", "Log+in");
      body.set("authenticity_token", token[1]);
    }

    const formData = new URLSearchParams();

    // Request login form page
    return this.http
      .get(this.getPath(signInEndpoint()), { responseType: "text" })
      .pipe(
        // Extract form data from login form
        tap((page: string) => setFormData(page, formData)),
        // Mimic a traditional form-based sign in to get a well-formed auth cookie
        // Needed because of https://github.com/QutEcoacoustics/baw-server/issues/509
        mergeMap(() => this.signInWithFormData(formData)),
        // Trade the cookie for an API auth token (mimicking old baw-client)
        mergeMap(() =>
          this.apiShow(sessionUserEndpoint(Date.now().toString()))
        ),
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
        // Handle errors
        catchError(this.handleError)
      );
  }

  /**
   * Logout user and clear session storage values
   * TODO Clear cookies
   */
  public signOut(): Observable<void> {
    return this.apiDestroy(signOutEndpoint()).pipe(
      map(() => {
        this.clearSessionUser();
        this.authTrigger.next(null);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Use the form-based sign in to authenticate. The server will issue a
   * traditional session cookie which we will later trade for an auth token
   */
  private signInWithFormData(formData: URLSearchParams) {
    return this.formDataRequest(this.getPath(signInEndpoint()), formData);
  }

  /**
   * Use the form-based sign in to authenticate. The server will issue a
   * traditional session cookie which we will later trade for an auth token
   */
  private signUpWithFormData(formData: URLSearchParams) {
    return this.formDataRequest(this.getPath(signUpEndpoint()), formData);
  }

  private formDataRequest(path: string, formData: URLSearchParams) {
    return this.http.post(path, formData.toString(), {
      responseType: "text",
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "text/html",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });
  }
}

export interface ILoginDetails {
  login?: string;
  password?: string;
}

export class LoginDetails extends AbstractModel implements ILoginDetails {
  public readonly kind = "LoginDetails";
  @bawPersistAttr
  public readonly login: string;
  @bawPersistAttr
  public readonly password: string;

  public constructor(details: ILoginDetails) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}

export interface IRegisterDetails {
  userName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  recaptchaToken: string;
}

export class RegisterDetails extends AbstractModel implements IRegisterDetails {
  public readonly kind = "RegisterDetails";
  @bawPersistAttr
  public readonly userName: string;
  @bawPersistAttr
  public readonly email: string;
  @bawPersistAttr
  public readonly password: string;
  @bawPersistAttr
  public readonly passwordConfirmation: string;
  @bawPersistAttr
  public readonly recaptchaToken: string;

  public constructor(details: IRegisterDetails) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}
