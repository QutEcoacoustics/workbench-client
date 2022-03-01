import { Injectable } from "@angular/core";
import { Session } from "@models/User";
import { Observable } from "rxjs";
import { BawApiService } from "../baw-api.service";

@Injectable()
export class MockSecurityService extends BawApiService<Session> {
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
}
