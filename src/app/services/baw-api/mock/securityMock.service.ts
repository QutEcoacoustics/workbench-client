import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SessionUser } from "src/app/models/User";
import { BawApiService } from "../baw-api.service";

@Injectable()
export class MockSecurityService extends BawApiService<SessionUser> {
  public register() {
    return new Observable<SessionUser>();
  }

  public signIn() {
    return new Observable<SessionUser>();
  }

  public signOut() {
    return new Observable<void>();
  }

  public getAuthTrigger() {
    return new BehaviorSubject(null);
  }
}
