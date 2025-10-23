import { ANALYSIS_JOB, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { Id, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { AnalysisJob } from "./AnalysisJob";
import { hasOne } from "./AssociationDecorators";
import { AudioRecording } from "./AudioRecording";
import { AssociationInjector } from "./ImplementsInjector";

export type ResultsItemType = "directory" | "file";

export interface IAnalysisJobItemResult {
  id?: Id;
  resultsPath?: string;
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
    injector?: AssociationInjector
  ) {
    super(analysisJobItemResults, injector);
  }

  public readonly kind = "Analysis Job Item Results";
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly resultsPath?: Param;
  public readonly analysisJobId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly sizeBytes?: number;
  public readonly mime?: Param;
  public readonly hasChildren?: boolean;
  public readonly hasZip?: boolean;
  public readonly type?: ResultsItemType = "directory";
  public readonly children?: AnalysisJobItemResult[];

  // Associations
  @hasOne(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;
  @hasOne(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  public get viewUrl(): string {
    throw new Error("AnalysisJobItemResult viewUrl not implemented.");
  }
}
