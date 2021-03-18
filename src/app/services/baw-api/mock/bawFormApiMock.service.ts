import { Injectable } from "@angular/core";
import { AbstractForm } from "@models/AbstractForm";

export class MockForm extends AbstractForm {
  public getBody(): URLSearchParams {
    return new URLSearchParams();
  }
}

@Injectable()
export class MockBawFormApiService {
  public constructor() {}

  public isLoggedIn() {
    return false;
  }

  public getSessionUser() {
    return null;
  }
}
