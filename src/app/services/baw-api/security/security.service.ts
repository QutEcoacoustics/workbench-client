import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AbstractModel } from "@models/AbstractModel";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { SessionUser, User } from "@models/User";
import { BehaviorSubject, Observable, ObservableInput, throwError } from "rxjs";
import { catchError, map, mergeMap, tap } from "rxjs/operators";
import { ApiErrorDetails } from "../api.interceptor.service";
import { apiReturnCodes, BawApiService } from "../baw-api.service";
import { UserService } from "../user/user.service";

function timestamp(x: number) {
  return x;
}

const registerEndpoint = stringTemplate`/security/`;
const signInEndpoint = stringTemplate`/my_account/sign_in`;
const signOutEndpoint = stringTemplate`/security/`;
const sessionUserEndpoint = stringTemplate`/security/user?antiCache=${timestamp}`;

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
  public register(details: any): Observable<void> {
    return this.handleAuth(this.apiCreate(registerEndpoint(), details));
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
      }

      // Extract auth token if exists
      const token = page.match(/name="authenticity_token" value="(.+?)"/);
      if (typeof token[1] !== "string") {
        throwError(err);
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
        // Request api cookie
        mergeMap(() => this.requestApiCookie(formData)),
        // Get session user
        mergeMap(() => this.apiShow(sessionUserEndpoint(Date.now()))),
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
   * Request api auth cookie
   */
  private requestApiCookie(formData: URLSearchParams) {
    return this.http.post(this.getPath(signInEndpoint()), formData.toString(), {
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

export interface LoginDetailsInterface {
  login?: string;
  password?: string;
}

export class LoginDetails
  extends AbstractModel
  implements LoginDetailsInterface {
  public readonly kind: "LoginDetails" = "LoginDetails";
  @bawPersistAttr
  public readonly login: string;
  @bawPersistAttr
  public readonly password: string;

  public constructor(details: LoginDetailsInterface) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}
