import { Injectable } from "@angular/core";
import { AbstractModel } from "src/app/models/AbstractModel";

export class MockModel extends AbstractModel {}

@Injectable()
export class MockBawApiService {
  constructor() {}

  public isLoggedIn() {
    return false;
  }

  public getSessionUser() {
    return null;
  }
}
