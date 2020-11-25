import { Injector } from "@angular/core";
import { TAG } from "@baw-api/ServiceTokens";
import { listenMenuItem } from "@helpers/page/externalMenus";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { Tag } from "./Tag";
import type { User } from "./User";

export interface ITagging extends HasCreatorAndUpdater {
  id?: Id;
  audioEventId?: Id;
  tagId?: Id;
}

export class Tagging extends AbstractModel implements ITagging {
  public readonly kind = "Tagging";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioEventId?: Id;
  @BawPersistAttr
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Tagging>()
  public creator?: User;
  @Updater<Tagging>()
  public updater?: User;
  // TODO Add association with AudioEvent
  @HasOne<Tagging, Tag>(TAG, "tagId")
  public tag?: Tag;

  constructor(tagging: ITagging, injector?: Injector) {
    super(tagging, injector);
  }

  public get viewUrl(): string {
    console.error("Tagging viewUrl not fully implemented");
    return listenMenuItem.uri();
  }
}
