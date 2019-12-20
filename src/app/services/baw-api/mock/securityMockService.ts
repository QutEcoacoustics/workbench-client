import { BehaviorSubject, Observable, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { APIErrorDetails } from "../api.interceptor";

export class MockSecurityService {
  private loggedIn = false;
  private trigger = new BehaviorSubject<boolean>(false);

  public signIn(details: {
    login: string;
    password: string;
  }): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();

    if (details.login === "username" && details.password === "password") {
      this.loggedIn = true;
      subject.next(true);
      this.trigger.next(true);
    } else {
      this.loggedIn = false;
      subject.error({
        status: 401,
        message: "Unauthorized"
      } as APIErrorDetails);
      this.trigger.next(false);
    }

    subject.pipe(delay(50));
    return subject.asObservable();
  }

  public register(details: {
    username: string;
    email: string;
    password: string;
  }): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();

    if (
      details.username === "username" &&
      details.email === "email" &&
      details.password === "password"
    ) {
      this.loggedIn = true;
      subject.next(true);
      this.trigger.next(true);
    } else {
      this.loggedIn = false;
      subject.error({
        status: 401,
        message: "Unauthorized"
      } as APIErrorDetails);
      this.trigger.next(false);
    }

    subject.pipe(delay(50));
    return subject.asObservable();
  }

  public signOut() {
    this.trigger.next(false);
  }

  public getLoggedInTrigger() {
    return this.trigger;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
