import { Injector } from "@angular/core";
import { DATASET_ITEM } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { DatasetItem } from "./DatasetItem";
import type { User } from "./User";

export interface IProgressEvent {
  id?: Id;
  creatorId?: Id;
  datasetItemId?: Id;
  activity?: string;
  createdAt?: DateTimeTimezone | string;
}

export class ProgressEvent extends AbstractModel implements IProgressEvent {
  public readonly kind = "ProgressEvent";
  @BawPersistAttr
  public readonly id?: Id;
  public readonly creatorId?: Id;
  @BawPersistAttr
  public readonly datasetItemId?: Id;
  @BawPersistAttr
  public readonly activity?: string;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;

  // Associations
  @Creator<ProgressEvent>()
  public creator?: User;
  @HasOne<ProgressEvent>(DATASET_ITEM, "datasetItemId")
  public datasetItem?: DatasetItem;

  public static generate(id?: Id): IProgressEvent {
    return {
      id: modelData.id(id),
      creatorId: modelData.id(),
      datasetItemId: modelData.id(),
      activity: "viewed", // TODO Replace with list of possibilities
      createdAt: modelData.timestamp(),
    };
  }

  constructor(progressEvent: IProgressEvent, injector?: Injector) {
    super(progressEvent, injector);
  }

  public get viewUrl(): string {
    throw new Error("ProgressEvent viewUrl not implemented.");
  }
}
