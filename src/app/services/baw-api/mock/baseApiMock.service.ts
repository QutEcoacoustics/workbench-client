import { Injectable } from "@angular/core";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";

export class MockModel extends AbstractModel {
  public readonly id: Id;

  public toJSON() {
    const json = {};
    this.addIfExists(json, "id", this.id);
    return json;
  }

  public get viewUrl(): string {
    return "";
  }
}

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
