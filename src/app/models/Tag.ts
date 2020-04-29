import { adminTagsMenuItem } from "@component/admin/tags/tags.menus";
import { startCase } from "lodash";
import { Observable } from "rxjs";
import { DateTimeTimezone, Id } from "../interfaces/apiInterfaces";
import { AbstractData } from "./AbstractData";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
  Updater,
} from "./AbstractModel";
import type { User } from "./User";

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
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly text?: string;
  // * Count attribute is unlikely to be an API output
  @BawPersistAttr
  public readonly count?: number;
  @BawPersistAttr
  public readonly isTaxanomic?: boolean;
  @BawPersistAttr
  public readonly typeOfTag?: string;
  @BawPersistAttr
  public readonly retired?: boolean;
  @BawPersistAttr
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Tag>()
  public creator?: Observable<User>;
  @Updater<Tag>()
  public updater?: Observable<User>;

  constructor(tag: ITag) {
    super(tag);
  }

  public get viewUrl(): string {
    return adminTagsMenuItem.route.toString();
  }
}

export class TagType extends AbstractData {
  public readonly kind: "TagType" = "TagType";
  public readonly name: string;

  constructor(data: { name: string }) {
    super(data);
  }

  toString() {
    return startCase(this.name);
  }
}
