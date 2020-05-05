import { Injector } from "@angular/core";
import { adminScriptsMenuItem } from "@component/admin/scripts/scripts.menus";
import { Observable } from "rxjs";
import { DateTimeTimezone, Id, Param } from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
} from "./AbstractModel";
import type { User } from "./User";

/**
 * A script model
 */
export interface IScript {
  id?: Id;
  name?: Param;
  description?: string;
  analysisIdentifier?: string;
  version?: number;
  verified?: boolean;
  groupId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  executableCommand?: string;
  executableSettings?: string;
  executableSettingsMediaType?: string;
  analysisActionParams?: string;
}

export class Script extends AbstractModel implements IScript {
  public readonly kind: "Script" = "Script";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: string;
  @BawPersistAttr
  public readonly analysisIdentifier?: string;
  @BawPersistAttr
  public readonly version?: number;
  @BawPersistAttr
  public readonly verified?: boolean;
  public readonly groupId?: Id;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly executableCommand?: string;
  @BawPersistAttr
  public readonly executableSettings?: string;
  @BawPersistAttr
  public readonly executableSettingsMediaType?: string;
  @BawPersistAttr
  public readonly analysisActionParams?: string;

  // Associations
  // TODO Add Group associations
  @Creator<Script>()
  public creator?: Observable<User>;

  constructor(script: IScript, injector?: Injector) {
    super(script, injector);

    this.executableSettingsMediaType = script.executableSettingsMediaType
      ? script.executableSettingsMediaType
      : "text/plain";
  }

  public get viewUrl(): string {
    return adminScriptsMenuItem.route.toString();
  }

  public toString(): string {
    return this.name;
  }
}
