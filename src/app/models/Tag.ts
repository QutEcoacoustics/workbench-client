import { adminTagsMenuItem } from "@component/admin/tags/tags.menus";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * Tag model interface
 */
export interface ITag {
  id?: Id;
  text?: string;
  count?: number;
  isTaxanomic?: boolean;
  typeOfTag?: string;
  retired?: boolean;
  notes?: Blob;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

/**
 * Tag model
 */
export class Tag extends AbstractModel implements ITag {
  public readonly kind: "AbstractModel" = "AbstractModel";
  public readonly id?: Id;
  public readonly text?: string;
  public readonly count?: number;
  public readonly isTaxanomic?: boolean;
  public readonly typeOfTag?: string;
  public readonly retired?: boolean;
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  constructor(tag: ITag) {
    super(tag);

    this.createdAt = dateTimeTimezone(tag.createdAt as string);
    this.updatedAt = dateTimeTimezone(tag.updatedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      text: this.text,
      count: this.count,
      isTaxanomic: this.isTaxanomic,
      typeOfTag: this.typeOfTag,
      retired: this.retired,
      notes: this.notes,
    };
  }

  public navigationPath(): string {
    return adminTagsMenuItem.route.toString();
  }
}
