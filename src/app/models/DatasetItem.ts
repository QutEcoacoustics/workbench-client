import { ACCOUNT } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  HasOne,
} from "./AbstractModel";
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
  // TODO Create Dataset, AudioRecording association
  @HasOne(ACCOUNT, (m: DatasetItem) => m.creatorId)
  public creator?: Observable<User>;

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
