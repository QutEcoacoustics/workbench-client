import { Injectable } from "@angular/core";
import { AuthToken, UserConcent } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";

export type GuestUser = undefined;
export type GuestAuthToken = undefined;
export const guestUser: GuestUser = undefined;
export const guestAuthToken: GuestAuthToken = undefined;

export interface AuthTriggerData {
  user: User | GuestUser;
  authToken?: AuthToken | GuestAuthToken;
}

@Injectable()
export class BawSessionService {
  private _authTrigger = new BehaviorSubject<AuthTriggerData>({
    user: guestUser,
  });
  private _authTriggerAfterInitialCheck = new ReplaySubject<AuthTriggerData>(1);
  private _initialAuthCheckComplete = false;
  private _loggedInUser: User | GuestUser;
  private _authToken: AuthToken | GuestAuthToken;

  /** Get logged in user */
  public get loggedInUser(): User | GuestUser {
    return this._loggedInUser;
  }

  /** Get user auth token */
  public get authToken(): AuthToken | GuestAuthToken {
    return this._authToken;
  }

  public get currentUser(): User {
    if (this.isLoggedIn) {
      return this.loggedInUser!;
    }

    return User.getUnknownUser(undefined!);
  }

  public get isContactable(): UserConcent {
    // @ts-expect-error: strict mode fix
    return this.loggedInUser.contactable!;
  }

  /** Is user logged in */
  public get isLoggedIn(): boolean {
    return !!this.authToken;
  }

  /** Returns a subject which tracks the change in loggedIn status */
  public get authTrigger(): Observable<AuthTriggerData> {
    return this._authTrigger;
  }

  /** Returns auth changes after the initial sign-in check has completed.
   *  Use this over `authTrigger` if you want to ensure that the initial sign-in check has completed before subscribing.
   *  This prevents page churn when the user is logged in and the initial sign-in check has not completed yet.
   */
  public get authTriggerAfterInitialCheck(): Observable<AuthTriggerData> {
    return this._authTriggerAfterInitialCheck;
  }

  /** Mark the initial sign-in check complete and emit the current auth state. */
  public completeInitialAuthCheck(): void {
    if (this._initialAuthCheckComplete) {
      return;
    }

    this._initialAuthCheckComplete = true;
    this._authTriggerAfterInitialCheck.next(this.currentAuthState());
  }

  /** Set user details */
  public setLoggedInUser(user: User, authToken: AuthToken): void {
    this._loggedInUser = user;
    this._authToken = authToken;
    this.emitAuthState({ user, authToken });
  }

  /** Clear user details */
  public async clearLoggedInUser(): Promise<void> {
    if (
      this._loggedInUser === guestUser &&
      this._authToken === guestAuthToken
    ) {
      return;
    }

    this._loggedInUser = guestUser;
    this._authToken = guestAuthToken;
    this.emitAuthState({ user: guestUser });
  }

  private currentAuthState(): AuthTriggerData {
    return { user: this._loggedInUser, authToken: this._authToken };
  }

  private emitAuthState(state: AuthTriggerData): void {
    this._authTrigger.next(state);

    if (this._initialAuthCheckComplete) {
      this._authTriggerAfterInitialCheck.next(state);
    }
  }

  public addAuthTokenToUrl(url: string): string {
    if (!this.authToken) {
      return url;
    }

    const urlObj = new URL(url);
    urlObj.searchParams.set("user_token", this.authToken);

    return urlObj.toString();
  }
}
