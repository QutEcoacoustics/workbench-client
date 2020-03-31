import { adminTagsMenuItem } from "../component/admin/admin.menus";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * Tag model interface
 */
export interface TagInterface {
  id?: Id;
  text?: string;
  count?: number;
  isTaxanomic?: boolean;
  typeOfTag?: string;
  retired?: boolean;
  notes?: string;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

/**
 * Tag model
 */
export class Tag extends AbstractModel implements TagInterface {
  public readonly kind: "AbstractModel" = "AbstractModel";
  public readonly id?: Id;
  public readonly text?: string;
  public readonly count?: number;
  public readonly isTaxanomic?: boolean;
  public readonly typeOfTag?: string;
  public readonly retired?: boolean;
  public readonly notes?: string;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  constructor(tag: TagInterface) {
    super(tag);

    this.createdAt = dateTimeTimezone(tag.createdAt as string);
    this.updatedAt = dateTimeTimezone(tag.updatedAt as string);
  }

  static fromJSON = (obj: any) => {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }

    return new Tag(obj);
  };

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      count: this.count,
      isTaxanomic: this.isTaxanomic,
      typeOfTag: this.typeOfTag,
      retired: this.retired,
      notes: this.notes,
      creatorId: this.creatorId,
      updaterId: this.updaterId,
      createdAt: this.createdAt?.toISO(),
      updatedAt: this.updatedAt?.toISO()
    };
  }

  redirectPath(): string {
    return adminTagsMenuItem.route.toString();
  }
}
