import { AUDIO_RECORDING, DATASET } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, hasOne } from "./AssociationDecorators";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
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

export class DatasetItem
  extends AbstractModel<IDatasetItem>
  implements IDatasetItem
{
  public readonly kind = "Dataset Item";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly datasetId?: Id;
  @bawPersistAttr()
  public readonly audioRecordingId?: Id;
  public readonly creatorId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawPersistAttr()
  public readonly startTimeSeconds?: number;
  @bawPersistAttr()
  public readonly endTimeSeconds?: number;
  @bawPersistAttr()
  public readonly order?: number;

  // Associations
  @creator<DatasetItem>()
  public creator?: User;
  @hasOne<DatasetItem, Dataset>(DATASET, "datasetId")
  public dataset?: Dataset;
  @hasOne<DatasetItem, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  public get viewUrl(): string {
    throw new Error("DatasetItem viewUrl not implemented.");
  }
}
