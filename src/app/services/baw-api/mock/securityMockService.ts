import { Injectable } from "@angular/core";
import { BawApiService } from "../base-api.service";

@Injectable({
  providedIn: "root"
})
export class MockSecurityService extends BawApiService {
  public signIn() {}

  public register() {}

  public signOut() {}

  public getLoggedInTrigger() {}
}
