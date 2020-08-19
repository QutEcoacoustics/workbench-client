import { Injector } from "@angular/core";
import { TAG } from "@baw-api/ServiceTokens";
import { adminTagGroupsMenuItem } from "@components/admin/tag-group/tag-group.menus";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { Tag } from "./Tag";
import type { User } from "./User";

/**
 * A tag group model
 */
export interface ITagGroup {
  id?: Id;
  groupIdentifier?: string;
  tagId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
}

/**
 * A tag group model
 */
export class TagGroup extends AbstractModel implements ITagGroup {
  public readonly kind = "TagGroup";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly groupIdentifier?: string;
  @BawPersistAttr
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @Creator<TagGroup>()
  public creator?: User;
  @HasOne<TagGroup>(TAG, "tagId")
  public tag?: Tag;

  constructor(tagGroup: ITagGroup, injector?: Injector) {
    super(tagGroup, injector);
  }

  public get viewUrl(): string {
    return adminTagGroupsMenuItem.route.toString();
  }
}
