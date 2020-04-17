import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

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
  public readonly id?: Id;
  public readonly datasetId?: Id;
  public readonly audioRecordingID?: Id;
  public readonly creatorId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly startTimeSeconds?: number;
  public readonly endTimeSeconds?: number;
  public readonly order?: number;

  constructor(datasetItem: IDatasetItem) {
    super(datasetItem);

    this.createdAt = dateTimeTimezone(datasetItem.createdAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      datasetId: this.datasetId,
      audioRecordingID: this.audioRecordingID,
      startTimeSeconds: this.startTimeSeconds,
      endTimeSeconds: this.endTimeSeconds,
      order: this.order,
    };
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
