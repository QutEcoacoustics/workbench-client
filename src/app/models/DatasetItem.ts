import { ACCOUNT, DATASET } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
import type { Dataset } from "./Dataset";
import type { User } from "./User";

export interface IDatasetItem {
  id?: Id;
  datasetId?: Id;
  audioRecordingID?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  order?: number;
}

export class DatasetItem extends AbstractModel implements IDatasetItem {
  public readonly kind: "DatasetItem" = "DatasetItem";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly datasetId?: Id;
  @BawPersistAttr
  public readonly audioRecordingID?: Id;
  public readonly creatorId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly startTimeSeconds?: number;
  @BawPersistAttr
  public readonly endTimeSeconds?: number;
  @BawPersistAttr
  public readonly order?: number;

  // Associations
  // TODO Create AudioRecording association
  @HasOne(DATASET, (m: DatasetItem) => m.datasetId)
  public dataset?: Observable<Dataset>;
  @HasOne(ACCOUNT, (m: DatasetItem) => m.creatorId)
  public creator?: Observable<User>;

  constructor(datasetItem: IDatasetItem) {
    super(datasetItem);
  }

  public get viewUrl(): string {
    throw new Error("DatasetItem viewUrl not implemented.");
  }
}
