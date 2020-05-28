import { Injector } from "@angular/core";
import { ANALYSIS_JOB, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import { AbstractModel } from "./AbstractModel";
import type { AnalysisJob } from "./AnalysisJob";
import { HasOne } from "./AssociationDecorators";
import { BawDateTime } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";

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
  @HasOne<AnalysisJobItem>(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;
  @HasOne<AnalysisJobItem>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  constructor(analysisJobItem: IAnalysisJobItem, injector?: Injector) {
    super(analysisJobItem, injector);
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
