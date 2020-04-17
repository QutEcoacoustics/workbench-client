import { adminTagGroupsMenuItem } from "@component/admin/tag-group/tag-group.menus";
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
  tagId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
}

/**
 * A tag group model
 */
export class TagGroup extends AbstractModel implements ITagGroup {
  public readonly kind: "TagGroup" = "TagGroup";
  public readonly id?: Id;
  public readonly groupIdentifier?: string;
  public readonly tagId?: Id;
  public readonly creatorId?: Id;
  public readonly createdAt?: DateTimeTimezone;

  constructor(tagGroup: ITagGroup) {
    super(tagGroup);

    this.createdAt = dateTimeTimezone(tagGroup.createdAt as string);
  }

  public navigationPath(): string {
    return adminTagGroupsMenuItem.route.toString();
  }

  public toJSON() {
    return {
      id: this.id,
      groupIdentifier: this.groupIdentifier,
      tagId: this.tagId,
    };
  }
}
