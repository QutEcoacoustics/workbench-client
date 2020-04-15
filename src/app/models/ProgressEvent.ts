import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IProgressEvent {
  id?: Id;
  creatorId?: Id;
  datasetItemId?: Id;
  activity?: string;
  createdAt?: DateTimeTimezone | string;
}

export class ProgressEvent extends AbstractModel implements IProgressEvent {
  public readonly kind: "ProgressEvent" = "ProgressEvent";
  public readonly id?: Id;
  public readonly creatorId?: Id;
  public readonly datasetItemId?: Id;
  public readonly activity?: string;
  public readonly createdAt?: DateTimeTimezone;

  constructor(progressEvent: IProgressEvent) {
    super(progressEvent);

    this.createdAt = dateTimeTimezone(progressEvent.createdAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      datasetItemId: this.datasetItemId,
      activity: this.activity,
    };
  }

  public navigationPath(): string {
    return "/BROKEN_LINK";
  }
}
