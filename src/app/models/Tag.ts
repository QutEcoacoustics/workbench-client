import { libraryMenuItem } from "@components/library/library.menus";
import {
  DateTimeTimezone,
  HasCreatorAndUpdater,
  Hash,
  Id,
} from "../interfaces/apiInterfaces";
import { AbstractData } from "./AbstractData";
import { AbstractModel } from "./AbstractModel";
import { creator, updater } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

/**
 * Tag model interface
 */
export interface ITag extends HasCreatorAndUpdater {
  id?: Id;
  text?: string;
  isTaxonomic?: boolean;
  typeOfTag?: string;
  retired?: boolean;
  notes?: Hash;
}

/**
 * Tag model
 */
export class Tag extends AbstractModel<ITag> implements ITag {
  public readonly kind = "Tag";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly text?: string;
  @bawPersistAttr()
  public readonly isTaxonomic?: boolean;
  @bawPersistAttr()
  public readonly typeOfTag?: string;
  @bawPersistAttr()
  public readonly retired?: boolean;
  @bawPersistAttr()
  public readonly notes?: Hash;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @creator<Tag>()
  public creator?: User;
  @updater<Tag>()
  public updater?: User;

  public get viewUrl(): string {
    return libraryMenuItem.route.format(undefined, {
      reference: "all",
      tagsPartial: this.text,
    });
  }

  public toString(): string {
    return this.text;
  }
}

export class TagType extends AbstractData {
  public readonly kind = "TagType";
  public readonly name: string;

  public constructor(data: { name: string }) {
    super(data);
  }
}
