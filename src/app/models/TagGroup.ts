import { adminTagGroupsMenuItem } from "../component/admin/admin.menus";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * A tag group model
 */
export interface ITagGroup {
  id?: Id;
  groupIdentifier?: string;
  createdAt?: DateTimeTimezone | string;
  creatorId?: Id;
  tagId?: Id;
}

/**
 * A tag group model
 */
export class TagGroup extends AbstractModel implements ITagGroup {
  public readonly kind: "TagGroup" = "TagGroup";
  public readonly id?: Id;
  public readonly groupIdentifier?: string;
  public readonly createdAt?: DateTimeTimezone;
  public readonly creatorId?: Id;
  public readonly tagId?: Id;

  constructor(tagGroup: ITagGroup) {
    super(tagGroup);

    this.createdAt = dateTimeTimezone(tagGroup.createdAt as string);
  }

  public navigationPath(): string {
    return adminTagGroupsMenuItem.route.toString();
  }

  public toJSON(): object {
    return {
      id: this.id,
      groupIdentifier: this.groupIdentifier,
      tagId: this.tagId,
    };
  }
}
