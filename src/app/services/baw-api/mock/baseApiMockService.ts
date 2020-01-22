import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MockBawApiService {
  constructor() {}

  public isLoggedIn() {
    return false;
  }

  public getSessionUser() {
    return null;
  }
}
