import { Injector } from "@angular/core";
import { SCRIPT } from "@baw-api/ServiceTokens";
import { adminScriptMenuItem } from "@components/admin/scripts/scripts.menus";
import {
  DateTimeTimezone,
  Description,
  HasCreator,
  HasDescription,
  Hash,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

/**
 * A script model
 */
export interface IScript extends HasCreator, HasDescription {
  id?: Id;
  name?: Param;
  analysisIdentifier?: string;
  version?: number;
  verified?: boolean;
  groupId?: Id;
  executableCommand?: string;
  executableSettings?: string;
  executableSettingsMediaType?: string;
  analysisActionParams?: Hash;
}

export class Script extends AbstractModel implements IScript {
  public readonly kind = "Script";
  @bawPersistAttr
  public readonly id?: Id;
  @bawPersistAttr
  public readonly name?: Param;
  @bawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawPersistAttr
  public readonly analysisIdentifier?: string;
  @bawPersistAttr
  public readonly version?: number;
  @bawPersistAttr
  public readonly verified?: boolean;
  public readonly groupId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawPersistAttr
  public readonly executableCommand?: string;
  @bawPersistAttr
  public readonly executableSettings?: string;
  @bawPersistAttr
  public readonly executableSettingsMediaType?: string;
  @bawPersistAttr
  public readonly analysisActionParams?: Hash;

  // Associations
  @creator<Script>()
  public creator?: User;
  @hasOne<Script, Script>(SCRIPT, "groupId")
  public group?: Script;

  public constructor(script: IScript, injector?: Injector) {
    super(script, injector);
  }

  public get viewUrl(): string {
    throw Error("Script viewUrl not implement");
  }

  public get adminViewUrl(): string {
    return adminScriptMenuItem.route.format({ scriptId: this.id });
  }
}
