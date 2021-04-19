import { Injectable, Injector } from "@angular/core";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel, getUnknownViewUrl } from "@models/AbstractModel";

export class MockModel extends AbstractModel {
  public kind = "MockModel";
  public readonly id: Id;

  public constructor(raw: Record<string, any>, protected injector?: Injector) {
    super({ id: 1, ...raw }, injector);
  }

  public toJSON(_?: any) {
    return { id: this.id } as any;
  }

  public get viewUrl(): string {
    return getUnknownViewUrl("MockModel does not have a viewUrl");
  }
}

@Injectable()
export class MockBawApiService {
  public constructor() {}

  public isLoggedIn() {
    return false;
  }

  public getSessionUser() {
    return null;
  }
}
