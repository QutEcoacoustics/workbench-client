import { TAG } from "@baw-api/ServiceTokens";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne, updater } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { Tag } from "./Tag";
import type { User } from "./User";

export interface ITagging extends HasCreatorAndUpdater {
  id?: Id;
  audioEventId?: Id;
  tagId?: Id;
}

export class Tagging extends AbstractModel<ITagging> implements ITagging {
  public readonly kind = "Tagging";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly audioEventId?: Id;
  @bawPersistAttr()
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @creator<Tagging>()
  public creator?: User;
  @updater<Tagging>()
  public updater?: User;
  // TODO Add association with AudioEvent
  @hasOne<Tagging, Tag>(TAG, "tagId")
  public tag?: Tag;

  public get viewUrl(): string {
    throw Error("Tagging viewUrl not implemented");
  }
}
