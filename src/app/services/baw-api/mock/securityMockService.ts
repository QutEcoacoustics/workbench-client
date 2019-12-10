import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { delay } from "rxjs/operators";
import { AppConfigService } from "../../app-config/app-config.service";
import { BawApiService } from "../base-api.service";

export class MockSecurityService extends BawApiService {
  private loggedIn = false;
  private trigger = new BehaviorSubject<boolean>(false);

  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);
  }

  public signIn(details: {
    email: string;
    password: string;
  }): Observable<boolean | string> {
    const subject = new Subject<boolean | string>();

    if (details.email === "email" && details.password === "password") {
      this.loggedIn = true;
      subject.next(true);
      this.trigger.next(true);
    } else {
      this.loggedIn = false;
      subject.error("Error MSG");
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
      subject.error("Error MSG");
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
