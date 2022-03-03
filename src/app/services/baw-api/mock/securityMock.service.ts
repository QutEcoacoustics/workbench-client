import { Injectable } from "@angular/core";
import { RecaptchaSettings } from "@baw-api/baw-form-api.service";
import { SecurityService } from "@baw-api/security/security.service";
import { Session } from "@models/User";
import { Observable } from "rxjs";

@Injectable()
export class MockSecurityService extends SecurityService {
  public sessionDetails(): Observable<Session> {
    return new Observable<Session>();
  }

  public signUpSeed() {
    return new Observable<RecaptchaSettings>();
  }

  public signUp() {
    return new Observable<void>();
  }

  public signIn() {
    return new Observable<void>();
  }

  public signOut() {
    return new Observable<void>();
  }
}
