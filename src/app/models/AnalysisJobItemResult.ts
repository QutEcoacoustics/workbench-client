import { Injector } from "@angular/core";
import { ANALYSIS_JOB, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { Id, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { AnalysisJob } from "./AnalysisJob";
import { hasOne } from "./AssociationDecorators";
import { AudioRecording } from "./AudioRecording";

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
    injector?: Injector
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

  public userFriendlyFileSize(): string {
    // taken from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    // I need to find a better solution before PR (maybe library???)
    function formatBytes(bytes: number) {
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

    return formatBytes(this.sizeBytes);
  }
}
