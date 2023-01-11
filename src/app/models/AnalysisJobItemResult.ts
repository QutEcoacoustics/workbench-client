import { Injector } from "@angular/core";
import { Id, Param } from "@interfaces/apiInterfaces";
import { ANALYSIS_JOB, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import fileSize from "filesize";
import { AbstractModel } from "./AbstractModel";
import { AnalysisJob } from "./AnalysisJob";
import { AudioRecording } from "./AudioRecording";
import { hasOne } from "./AssociationDecorators";
import { bawBytes } from "./AttributeDecorators";

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
  children?: (IDirectory | IFile)[];
}

interface IDirectory {
  path?: string;
  name?: string;
  type?: ResultsItemType;
  hasChildren?: boolean;
}

interface IFile {
  name?: string;
  sizeBytes?: number;
  type: ResultsItemType;
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
  public readonly mime?: Param;
  public readonly hasChildren?: boolean;
  public readonly hasZip?: boolean;
  public readonly type?: ResultsItemType;
  public readonly children?: (IDirectory | IFile)[];
  public readonly sizeBytes?: number;
  @bawBytes<AnalysisJobItemResult>({ key: "sizeBytes" })

  // Associations
  @hasOne<AnalysisJobItemResult, AnalysisJob>(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;
  @hasOne<AnalysisJobItemResult, AudioRecording>(
    AUDIO_RECORDING,
    "audioRecordingId"
    )
  public audioRecording?: AudioRecording;

  public get isFolder(): boolean {
    return this.type === "directory";
  }

  public get isFile(): boolean {
    return this.type === "file";
  }

  public get humanReadableSize(): string {
    return this.sizeBytes ? fileSize(this.sizeBytes, { round: 2 }) : "";
  }

  public get viewUrl(): string {
    throw new Error("AnalysisJobItemResult viewUrl not implemented.");
  }
}
