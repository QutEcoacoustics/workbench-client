import { Injector } from "@angular/core";
import { ANALYSIS_JOB, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import type { AnalysisJob } from "./AnalysisJob";
import { hasOne } from "./AssociationDecorators";
import { bawDateTime } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";

export interface IAnalysisJobItem {
  id?: Id;
  analysisJobId?: Id;
  audioRecordingId?: Id;
  queueId?: string;
  status?: AnalysisJobItemStatus;
  createdAt?: DateTimeTimezone | string;
  queuedAt?: DateTimeTimezone | string;
  workStartedAt?: DateTimeTimezone | string;
  completedAt?: DateTimeTimezone | string;
  cancelStartedAt?: DateTimeTimezone | string;
}

export class AnalysisJobItem extends AbstractModel implements IAnalysisJobItem {
  public readonly kind = "Analysis Job Item";
  public readonly id?: Id;
  public readonly analysisJobId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly queueId?: string;
  public readonly status?: AnalysisJobItemStatus;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly queuedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly workStartedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly completedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly cancelStartedAt?: DateTimeTimezone;

  // Associations
  @hasOne<AnalysisJobItem, AnalysisJob>(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;
  @hasOne<AnalysisJobItem, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  public constructor(analysisJobItem: IAnalysisJobItem, injector?: Injector) {
    super(analysisJobItem, injector);
  }

  public get viewUrl(): string {
    // Potentially "/audio_analysis/{analysisJobId}/results{path}"?
    throw new Error("AnalysisJobItem viewUrl not implemented.");
  }
}

export type AnalysisJobItemStatus =
  | "successful"
  | "new"
  | "queued"
  | "working"
  | "failed"
  | "timed_out"
  | "cancelling"
  | "cancelled";
