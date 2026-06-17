import { Injectable } from "@angular/core";
import { AbstractForm } from "@models/AbstractForm";

export class MockForm extends AbstractForm {
  public getBody(): URLSearchParams {
    return new URLSearchParams();
  }
}

@Injectable({ providedIn: "root" })
export class MockBawFormApiService {
  public isLoggedIn() {
    return false;
  }

  public getSessionUser() {
    return null;
  }
}
