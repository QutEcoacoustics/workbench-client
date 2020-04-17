import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IAnalysisJobItem {
  id?: Id;
  analysisJobId?: Id;
  audioRecordingId?: Id;
  queueId?: string;
  status?: Status;
  createdAt?: DateTimeTimezone | string;
  queuedAt?: DateTimeTimezone | string;
  workStartedAt?: DateTimeTimezone | string;
  completedAt?: DateTimeTimezone | string;
  cancelStartedAt?: DateTimeTimezone | String;
}

export class AnalysisJobItem extends AbstractModel implements IAnalysisJobItem {
  public readonly kind: "AnalysisJobItem" = "AnalysisJobItem";
  public readonly id?: Id;
  public readonly analysisJobId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly queueId?: string;
  public readonly status?: Status;
  public readonly createdAt?: DateTimeTimezone;
  public readonly queuedAt?: DateTimeTimezone;
  public readonly workStartedAt?: DateTimeTimezone;
  public readonly completedAt?: DateTimeTimezone;
  public readonly cancelStartedAt?: DateTimeTimezone;

  constructor(analysisJobItem: IAnalysisJobItem) {
    super(analysisJobItem);

    this.createdAt = dateTimeTimezone(analysisJobItem.createdAt as string);
    this.queuedAt = dateTimeTimezone(analysisJobItem.queuedAt as string);
    this.workStartedAt = dateTimeTimezone(
      analysisJobItem.workStartedAt as string
    );
    this.completedAt = dateTimeTimezone(analysisJobItem.completedAt as string);
    this.cancelStartedAt = dateTimeTimezone(
      analysisJobItem.cancelStartedAt as string
    );
  }

  public toJSON() {
    return {
      id: this.id,
      analysisJobId: this.analysisJobId,
      audioRecordingId: this.audioRecordingId,
      queueId: this.queueId,
      status: this.status,
    };
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}

export type Status = "new" | "??? Anthony";
