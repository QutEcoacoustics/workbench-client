import { Injector } from "@angular/core";
import {
  DateTimeTimezone,
  Description,
  HasCreatorAndUpdater,
  HasDescription,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, updater } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IDataset extends HasCreatorAndUpdater, HasDescription {
  id?: Id;
  name?: Param;
}

export class Dataset extends AbstractModel implements IDataset {
  public readonly kind = "Dataset";
  @bawPersistAttr
  public readonly id?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @bawPersistAttr
  public readonly name?: Param;
  @bawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @creator<Dataset>()
  public creator: User;
  @updater<Dataset>()
  public updater?: User;

  public constructor(dataset: IDataset, injector?: Injector) {
    super(dataset, injector);
  }

  public get viewUrl(): string {
    throw new Error("Dataset viewUrl not implemented.");
  }
}
