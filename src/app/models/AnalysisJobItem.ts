import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel, BawDateTime, BawPersistAttr } from "./AbstractModel";

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
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly analysisJobId?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
  @BawPersistAttr
  public readonly queueId?: string;
  public readonly status?: Status;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly queuedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly workStartedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly completedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly cancelStartedAt?: DateTimeTimezone;

  // Associations
  // TODO Add AnalysisJob, AudioRecording, Queue associations

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}

// TODO
export type Status = "new" | "??? Anthony";
