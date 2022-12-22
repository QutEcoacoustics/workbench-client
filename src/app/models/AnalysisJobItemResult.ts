import { Injector } from "@angular/core";
import { Id, Param } from "@interfaces/apiInterfaces";
import { ANALYSIS_JOB, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { AbstractModel } from "./AbstractModel";
import { AnalysisJob } from "./AnalysisJob";
import { AudioRecording } from "./AudioRecording";
import { hasOne } from "./AssociationDecorators";

export type ResultsItemType = "directory" | "file";

export interface IAnalysisJobItemResult {
  id?: Id;
  path?: string;
  analysisJobId?: Id;
  audioRecordingId?: Id;
  name?: string;
  sizeBytes?: number;
  hasChildren?: boolean;
  hasZip?: boolean;
  type?: ResultsItemType;
  children?: AnalysisJobItemResult[];
}

export class AnalysisJobItemResult
  extends AbstractModel
  implements IAnalysisJobItemResult
{
  public constructor(
    analysisJobItemResults: IAnalysisJobItemResult,
    injector?: Injector
  ) {
    super(analysisJobItemResults, injector);
  }

  public readonly kind = "Analysis Job Item Results";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly path?: Param;
  public readonly analysisJobId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly sizeBytes?: number;
  public readonly mime?: Param;
  public readonly hasChildren?: boolean;
  public readonly hasZip?: boolean;
  public readonly type?: ResultsItemType;
  public readonly children?: AnalysisJobItemResult[];

  // Associations
  @hasOne<AnalysisJobItemResult, AnalysisJob>(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;
  @hasOne<AnalysisJobItemResult, AudioRecording>(
    AUDIO_RECORDING,
    "audioRecordingId"
  )
  public audioRecording?: AudioRecording;

  public get viewUrl(): string {
    throw new Error("AnalysisJobItemResult viewUrl not implemented.");
  }
}
