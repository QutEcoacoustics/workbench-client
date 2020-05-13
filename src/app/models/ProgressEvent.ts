import { Injector } from "@angular/core";
import { DATASET_ITEM } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel, Creator, HasOne } from "./AbstractModel";
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
  public readonly kind: "ProgressEvent" = "ProgressEvent";
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
  public creator?: Observable<User>;
  @HasOne(DATASET_ITEM, (m: ProgressEvent) => m.datasetItemId)
  public datasetItem?: Observable<DatasetItem>;

  constructor(progressEvent: IProgressEvent, injector?: Injector) {
    super(progressEvent, injector);
  }

  public get viewUrl(): string {
    throw new Error("ProgressEvent viewUrl not implemented.");
  }
}
