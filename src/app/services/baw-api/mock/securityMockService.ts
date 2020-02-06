import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SessionUser } from "src/app/models/User";
import { MockBawApiService } from "./baseApiMockService";

@Injectable({
  providedIn: "root"
})
export class MockSecurityService extends MockBawApiService {
  public register() {
    return new Observable<SessionUser>();
  }

  public signIn() {
    return new Observable<SessionUser>();
  }

  public signOut() {
    return new Observable<void>();
  }

  public getLoggedInTrigger() {
    return new BehaviorSubject(null);
  }
}
