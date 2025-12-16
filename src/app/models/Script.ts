import { AUDIO_EVENT_PROVENANCE, SCRIPT } from "@baw-api/ServiceTokens";
import { scriptMenuItem } from "@components/scripts/scripts.menus";
import { PbsResources } from "@interfaces/pbsInterfaces";
import {
  DateTimeTimezone,
  Description,
  ExecutableCommand,
  HasCreator,
  HasDescription,
  Id,
  Param,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { Provenance } from "./Provenance";
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
  provenanceId?: Id;
  executableCommand?: ExecutableCommand;
  executableSettings?: string;
  executableSettingsMediaType?: string;
  executableSettingsName?: string;
  resources?: PbsResources;
  isLastVersion?: boolean;
  isFirstVersion?: boolean;
}

export class Script extends AbstractModel<IScript> implements IScript {
  public readonly kind = "Script";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: Param;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawPersistAttr()
  public readonly analysisIdentifier?: string;
  @bawPersistAttr()
  public readonly version?: number;
  @bawPersistAttr()
  public readonly verified?: boolean;
  public readonly groupId?: Id;
  public readonly provenanceId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawPersistAttr()
  public readonly executableCommand?: string;
  @bawPersistAttr()
  public readonly executableSettings?: string;
  @bawPersistAttr()
  public readonly executableSettingsName?: string;
  @bawPersistAttr()
  public readonly executableSettingsMediaType?: string;
  @bawPersistAttr()
  public readonly resources?: PbsResources;
  public readonly isLastVersion?: boolean;
  public readonly isFirstVersion?: boolean;

  // Associations
  @creator()
  public creator?: User;
  @hasOne(SCRIPT, "groupId")
  public group?: Script;
  @hasOne(AUDIO_EVENT_PROVENANCE, "provenanceId")
  public provenance?: Provenance;

  public get viewUrl(): string {
    return scriptMenuItem.route.format({ scriptId: this.id });
  }
}
