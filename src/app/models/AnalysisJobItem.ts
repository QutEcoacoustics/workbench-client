import { ANALYSIS_JOB } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel, BawDateTime, HasOne } from "./AbstractModel";
import type { AnalysisJob } from "./AnalysisJob";

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
  cancelStartedAt?: DateTimeTimezone | string;
}

export class AnalysisJobItem extends AbstractModel implements IAnalysisJobItem {
  public readonly kind: "AnalysisJobItem" = "AnalysisJobItem";
  public readonly id?: Id;
  public readonly analysisJobId?: Id;
  public readonly audioRecordingId?: Id;
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
  @HasOne(ANALYSIS_JOB, (m: AnalysisJobItem) => m.analysisJobId)
  public analysisJob?: Observable<AnalysisJob>;
  // TODO Add AudioRecording, Queue associations

  constructor(analysisJobItem: IAnalysisJobItem) {
    super(analysisJobItem);
  }

  public get viewUrl(): string {
    throw new Error("AnalysisJobItem viewUrl not implemented.");
  }
}

export type Status =
  | "successful"
  | "new"
  | "queued"
  | "working"
  | "failed"
  | "timed_out"
  | "cancelling"
  | "cancelled";
