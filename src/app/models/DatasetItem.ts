import { Injector } from "@angular/core";
import { AUDIO_RECORDING, DATASET } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasOne } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { Dataset } from "./Dataset";
import type { User } from "./User";

export interface IDatasetItem {
  id?: Id;
  datasetId?: Id;
  audioRecordingId?: Id;
  creatorId?: Id;
  createdAt?: DateTimeTimezone | string;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  order?: number;
}

export class DatasetItem extends AbstractModel implements IDatasetItem {
  public readonly kind = "DatasetItem";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly datasetId?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
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
  @Creator<DatasetItem>()
  public creator?: User;
  @HasOne<DatasetItem, Dataset>(DATASET, "datasetId")
  public dataset?: Dataset;
  @HasOne<DatasetItem, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  public constructor(datasetItem: IDatasetItem, injector?: Injector) {
    super(datasetItem, injector);
  }

  public get viewUrl(): string {
    throw new Error("DatasetItem viewUrl not implemented.");
  }
}
