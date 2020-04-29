import { ACCOUNT, TAG } from "@baw-api/ServiceTokens";
import { adminTagGroupsMenuItem } from "@component/admin/tag-group/tag-group.menus";
import { Observable } from "rxjs";
import { DateTimeTimezone, Id } from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
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
  @HasOne(TAG, (m: TagGroup) => m.creatorId)
  public tag?: Observable<Tag>;
  @HasOne(ACCOUNT, (m: TagGroup) => m.creatorId)
  public creator?: Observable<User>;

  constructor(tagGroup: ITagGroup) {
    super(tagGroup);
  }

  public get viewUrl(): string {
    return adminTagGroupsMenuItem.route.toString();
  }
}
