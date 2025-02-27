import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { AUDIO_EVENT, TAG } from "@baw-api/ServiceTokens";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { creator, hasOne, updater } from "./AssociationDecorators";
import { User } from "./User";
import { Tag } from "./Tag";
import { AudioEvent } from "./AudioEvent";

// I do not use the enum provided by the web components because the enum type
// specified in the web components is a reflection of the web component
// representation of the verification status, while this enum if a reflection of
// the servers representation of the verification status
export enum ConfirmedStatus {
  Correct = "correct",
  Incorrect = "incorrect",
  Unsure = "unsure",
  Skip = "skip",
}

export interface IVerification extends HasCreatorAndUpdater {
  id?: Id;
  confirmed?: ConfirmedStatus;
  tagId?: Id;
  audioEventId?: Id;
}

export class Verification
  extends AbstractModel<IVerification>
  implements IVerification
{
  public readonly kind = "Verification";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly confirmed?: ConfirmedStatus;
  @bawPersistAttr()
  public readonly tagId?: Id;
  @bawPersistAttr()
  public readonly audioEventId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: Id;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @creator()
  public creator?: User;
  @updater()
  public updater?: User;

  @hasOne<Verification, Tag>(TAG, "tagId")
  public tag?: Tag;
  @hasOne<Verification, AudioEvent>(AUDIO_EVENT, "audioEventId")
  public audioEvent?: AudioEvent;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
