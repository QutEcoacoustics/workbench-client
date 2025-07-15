import { Injectable } from "@angular/core";
import { AuthToken, UserConcent } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { BehaviorSubject, Observable } from "rxjs";

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
      return this.loggedInUser;
    }

    return User.getUnknownUser(undefined);
  }

  public get isContactable(): UserConcent {
    return this.loggedInUser.contactable;
  }

  /** Is user logged in */
  public get isLoggedIn(): boolean {
    return !!this.authToken;
  }

  /** Returns a subject which tracks the change in loggedIn status */
  public get authTrigger(): Observable<AuthTriggerData> {
    return this._authTrigger;
  }

  /** Set user details */
  public setLoggedInUser(user: User, authToken: AuthToken): void {
    this._loggedInUser = user;
    this._authToken = authToken;
    this._authTrigger.next({ user, authToken });
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
    this._authTrigger.next({ user: guestUser });
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
