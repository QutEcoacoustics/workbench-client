import { Injector } from "@angular/core";
import {
  DateTimeTimezone,
  Description,
  Id,
  Param,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { User } from "./User";

export interface IDataset {
  id?: Id;
  creatorId?: Id;
  updaterId?: Id;
  name?: Param;
  description?: Description;
  descriptionHtml?: Description;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
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
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;

  // Associations
  @Creator<Dataset>()
  public creator: User;
  @Updater<Dataset>()
  public updater?: User;

  constructor(dataset: IDataset, injector?: Injector) {
    super(dataset, injector);
  }

  public get viewUrl(): string {
    throw new Error("Dataset viewUrl not implemented.");
  }
}
