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
import { Creator, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IDataset extends HasCreatorAndUpdater, HasDescription {
  id?: Id;
  name?: Param;
}

export class Dataset extends AbstractModel implements IDataset {
  public readonly kind = "Dataset";
  @BawPersistAttr
  public readonly id?: Id;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Dataset>()
  public creator: User;
  @Updater<Dataset>()
  public updater?: User;

  public constructor(dataset: IDataset, injector?: Injector) {
    super(dataset, injector);
  }

  public get viewUrl(): string {
    throw new Error("Dataset viewUrl not implemented.");
  }
}
