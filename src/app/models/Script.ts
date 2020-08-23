import { Injector } from "@angular/core";
import { SCRIPT } from "@baw-api/ServiceTokens";
import { adminScriptMenuItem } from "@components/admin/scripts/scripts.menus";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

/**
 * A script model
 */
export interface IScript {
  id?: Id;
  name?: Param;
  description?: Description;
  descriptionHtml?: Description;
  analysisIdentifier?: string;
  version?: number;
  verified?: boolean;
  groupId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  executableCommand?: string;
  executableSettings?: string;
  executableSettingsMediaType?: string;
  analysisActionParams?: object;
}

export class Script extends AbstractModel implements IScript {
  public readonly kind = "Script";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
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
  public readonly analysisActionParams?: object;

  // Associations
  @Creator<Script>()
  public creator?: User;
  @HasOne<Script>(SCRIPT, "groupId")
  public group?: Script;

  constructor(script: IScript, injector?: Injector) {
    super(script, injector);

    this.executableSettingsMediaType =
      script.executableSettingsMediaType ?? "text/plain";
  }

  public get viewUrl(): string {
    return adminScriptMenuItem.route.format({ scriptId: this.id });
  }
}
