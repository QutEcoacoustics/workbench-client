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

const signUpEndpoint = stringTemplate`/my_account/sign_up/`;
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
  private handleError: (err: ApiErrorDetails) => ObservableInput<any>;

  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    private userService: UserService,
    injector: Injector
  ) {
    super(http, apiRoot, SessionUser, injector);

    this.handleError = (err: ApiErrorDetails) => {
      this.clearSessionUser();
      this.authTrigger.next(null);
      return throwError(err);
    };
  }

  /**
   * Returns a subject which tracks the change in loggedIn status
   */
  public getAuthTrigger(): BehaviorSubject<void> {
    return this.authTrigger;
  }

  // TODO Register account. Path needs to be checked and inputs ascertained.
  public signUp(details: RegisterDetails): Observable<void> {
    function setFormData(page: any, body: URLSearchParams) {
      const err: ApiErrorDetails = {
        status: apiReturnCodes.unknown,
        message:
          "Unable to retrieve authenticity token for registration request",
      };

      // Catch wrong type of response
      if (typeof page !== "string") {
        throwError(err);
        return;
      }

      // Extract auth token if exists
      const token = page.match(/name="authenticity_token" value="(.+?)"/);
      if (!isInstantiated(token?.[1])) {
        throwError(err);
        return;
      }

      // Set form data
      body.set("user[user_name]", details.userName);
      body.set("user[email]", details.email);
      body.set("user[password]", details.password);
      body.set("user[password_confirmation]", details.passwordConfirmation);
      body.set("commit", "Register");
      body.set("authenticity_token", token[1]);
      // body.set("g-recaptcha-response-data[register]", undefined);
      // body.set("g-recaptcha-response", undefined);
    }

    const formData = new URLSearchParams();

    return this.http
      .get(this.getPath(signUpEndpoint()), { responseType: "text" })
      .pipe(
        // Extract form data from register form
        tap((page: string) => setFormData(page, formData)),
        // Mimic a traditional form-based sign up
        // Needed because of https://github.com/QutEcoacoustics/baw-server/issues/424
        mergeMap(() => this.signUpWithFormData(formData)),
        // Trade the cookie for an API auth token (mimicking old baw-client)
        mergeMap((response) => {
          console.log(response);
          return this.apiShow(sessionUserEndpoint(Date.now().toString()));
        }),
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
   * Login the user, this function can only be called if user
   * is not logged in.
   *
   * @param details Details provided by login form
   */
  public signIn(details: LoginDetails): Observable<void> {
    function setFormData(page: any, body: URLSearchParams) {
      const err: ApiErrorDetails = {
        status: apiReturnCodes.unknown,
        message: "Unable to retrieve authenticity token for login request",
      };

      // Catch wrong type of response
      if (typeof page !== "string") {
        throwError(err);
        return;
      }

      // Extract auth token if exists
      const token = page.match(/name="authenticity_token" value="(.+?)"/);
      if (!isInstantiated(token?.[1])) {
        throwError(err);
        return;
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

  /**
   * Handle register/login authentication requests
   *
   * @param apiRequest API Request
   */
  private handleAuth(apiRequest: Observable<SessionUser>): Observable<void> {
    return apiRequest.pipe(
      mergeMap((sessionUser: SessionUser) => {
        // Store authToken before making api request
        this.storeLocalUser(sessionUser);

        return this.userService
          .show()
          .pipe(
            map((user) => new SessionUser({ ...sessionUser, ...user.toJSON() }))
          );
      }),
      map((sessionUser: SessionUser) => {
        this.storeLocalUser(sessionUser);
        this.authTrigger.next(null);
      }),
      catchError(this.handleError)
    );
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

  public constructor(details: IRegisterDetails) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}
