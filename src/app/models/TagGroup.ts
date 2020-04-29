import { TAG } from "@baw-api/ServiceTokens";
import { adminTagGroupsMenuItem } from "@component/admin/tag-group/tag-group.menus";
import { Observable } from "rxjs";
import { DateTimeTimezone, Id } from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
  HasOne,
} from "./AbstractModel";
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
  public readonly kind: "TagGroup" = "TagGroup";
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
  public creator?: Observable<User>;
  @HasOne(TAG, (m: TagGroup) => m.tagId)
  public tag?: Observable<Tag>;

  constructor(tagGroup: ITagGroup) {
    super(tagGroup);
  }

  public get viewUrl(): string {
    return adminTagGroupsMenuItem.route.toString();
  }
}
