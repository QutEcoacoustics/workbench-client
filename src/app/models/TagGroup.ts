import { TAG } from "@baw-api/ServiceTokens";
import { adminTagGroupsMenuItem } from "@components/admin/tag-group/tag-group.menus";
import { DateTimeTimezone, HasCreator, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { Tag } from "./Tag";
import type { User } from "./User";

/**
 * A tag group model
 */
export interface ITagGroup extends HasCreator {
  id?: Id;
  groupIdentifier?: string;
  tagId?: Id;
}

/**
 * A tag group model
 */
export class TagGroup extends AbstractModel<ITagGroup> implements ITagGroup {
  public readonly kind = "Tag Group";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly groupIdentifier?: string;
  @bawPersistAttr()
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @creator<TagGroup>()
  public creator?: User;
  @hasOne<TagGroup, Tag>(TAG, "tagId")
  public tag?: Tag;

  public get viewUrl(): string {
    throw Error("TagGroup viewUrl not implemented");
  }

  public get adminViewUrl(): string {
    return adminTagGroupsMenuItem.route.format();
  }
}
