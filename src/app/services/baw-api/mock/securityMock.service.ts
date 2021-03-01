import { Injectable } from "@angular/core";
import { SessionUser } from "@models/User";
import { BehaviorSubject, Observable } from "rxjs";
import { BawApiService } from "../baw-api.service";

@Injectable()
export class MockSecurityService extends BawApiService<SessionUser> {
  public signUpSeed() {
    return new Observable();
  }

  public signUp() {
    return new Observable();
  }

  public signIn() {
    return new Observable();
  }

  public signOut() {
    return new Observable();
  }

  public getAuthTrigger() {
    return new BehaviorSubject(null);
  }
}
