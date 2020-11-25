import { Injector } from "@angular/core";
import { DATASET_ITEM } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, HasCreator, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { Dataset } from "./Dataset";
import type { DatasetItem } from "./DatasetItem";
import type { User } from "./User";

export interface IProgressEvent extends HasCreator {
  id?: Id;
  datasetItemId?: Id;
  activity?: string;
}

export class ProgressEvent extends AbstractModel implements IProgressEvent {
  public readonly kind = "ProgressEvent";
  @bawPersistAttr
  public readonly id?: Id;
  public readonly creatorId?: Id;
  @bawPersistAttr
  public readonly datasetItemId?: Id;
  @bawPersistAttr
  public readonly activity?: string;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @creator<ProgressEvent>()
  public creator?: User;
  // TODO Add association to DatasetItem

  public constructor(progressEvent: IProgressEvent, injector?: Injector) {
    super(progressEvent, injector);
  }

  public get viewUrl(): string {
    throw new Error("ProgressEvent viewUrl not implemented.");
  }
}
