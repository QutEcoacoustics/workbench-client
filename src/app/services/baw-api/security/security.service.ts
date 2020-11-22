import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AbstractModel } from "@models/AbstractModel";
import { BawPersistAttr } from "@models/AttributeDecorators";
import { SessionUser } from "@models/User";
import { BehaviorSubject, Observable, ObservableInput, throwError } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { ApiErrorDetails } from "../api.interceptor.service";
import { BawApiService } from "../baw-api.service";
import { UserService } from "../user/user.service";

const registerEndpoint = stringTemplate`/security/`;
const signInEndpoint = stringTemplate`/security/`;
const signOutEndpoint = stringTemplate`/security/`;

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
    return this.handleAuth(this.apiCreate(signInEndpoint(), details));
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
  @BawPersistAttr
  public readonly login: string;
  @BawPersistAttr
  public readonly password: string;

  public constructor(details: LoginDetailsInterface) {
    super(details);
  }

  public get viewUrl(): string {
    throw new Error("Not Implemented");
  }
}
