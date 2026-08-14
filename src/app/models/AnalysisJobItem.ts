import {
  ANALYSIS_JOB,
  AUDIO_EVENT_IMPORT_FILE,
  AUDIO_RECORDING,
  SCRIPT,
} from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id, Ids } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import type { AnalysisJob } from "./AnalysisJob";
import { hasMany, hasOne } from "./AssociationDecorators";
import {
  bawCollection,
  bawDateTime,
  bawReadonlyConvertCase,
} from "./AttributeDecorators";
import type { AudioEventImportFile } from "./AudioEventImportFile";
import type { AudioRecording } from "./AudioRecording";
import { AssociationInjector } from "./ImplementsInjector";
import type { Script } from "./Script";

export interface IAnalysisJobItem {
  id?: Id;
  analysisJobId?: Id;
  audioRecordingId?: Id;
  scriptId?: Id;
  queueId?: string;
  status?: AnalysisJobItemStatus;
  createdAt?: DateTimeTimezone | string;
  queuedAt?: DateTimeTimezone | string;
  workStartedAt?: DateTimeTimezone | string;
  finishedAt?: DateTimeTimezone | string;
  error?: string | null;
  attempts?: number;
  result?: AnalysisJobItemResultStatus | null;
  transition?: AnalysisJobItemTransition | null;
  usedWalltimeSeconds?: number;
  usedMemoryBytes?: number;
  audioEventImportFileIds?: Ids;
  importSuccess?: boolean | null;
}

export class AnalysisJobItem extends AbstractModel implements IAnalysisJobItem {
  public readonly kind = "Analysis Job Item";
  public readonly id?: Id;
  public readonly analysisJobId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly scriptId?: Id;
  public readonly queueId?: string;
  @bawReadonlyConvertCase()
  public readonly status?: AnalysisJobItemStatus;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly queuedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly workStartedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly finishedAt?: DateTimeTimezone;
  public readonly error?: string | null;
  public readonly attempts?: number;
  public readonly result?: AnalysisJobItemResultStatus | null;
  public readonly transition?: AnalysisJobItemTransition | null;
  public readonly usedWalltimeSeconds?: number;
  public readonly usedMemoryBytes?: number;
  @bawCollection({ persist: false })
  public readonly audioEventImportFileIds?: Ids;
  public readonly importSuccess?: boolean | null;

  // Associations
  @hasOne(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;
  @hasOne(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;
  @hasOne(SCRIPT, "scriptId")
  public script?: Script;
  // @ts-expect-error: strict mode fix
  @hasMany(AUDIO_EVENT_IMPORT_FILE, "audioEventImportFileIds"!)
  public audioEventImportFiles?: AudioEventImportFile[];

  public constructor(
    analysisJobItem: IAnalysisJobItem,
    injector?: AssociationInjector,
  ) {
    super(analysisJobItem, injector);
  }

  public get viewUrl(): string {
    // Potentially "/audio_analysis/{analysisJobId}/results{path}"?
    throw new Error("AnalysisJobItem viewUrl not implemented.");
  }
}

export type AnalysisJobItemStatus = "new" | "queued" | "working" | "finished";

export type AnalysisJobItemResultStatus =
  | "success"
  | "failed"
  | "killed"
  | "cancelled";

export type AnalysisJobItemTransition = "queue" | "cancel" | "retry" | "finish";
