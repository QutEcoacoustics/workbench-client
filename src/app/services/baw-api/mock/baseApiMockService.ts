import { Injectable } from "@angular/core";
import { SessionUser } from "src/app/models/User";

@Injectable({
  providedIn: "root"
})
export class MockBawApiService {
  constructor() {}

  public isLoggedIn(): boolean {
    return false;
  }

  public getSessionUser(): SessionUser | null {
    return null;
  }
}
