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
  children?: IChildren[];

  isFile?: () => boolean;
  isFolder?: () => boolean;
  humanReadableByteSize?: () => string;
}

export interface IChildren {
  path?: string;
  name?: string;
  type?: ResultsItemType;
  hasChildren?: boolean;
  sizeBytes?: number;

  isFile?: () => boolean;
  isFolder?: () => boolean;
  humanReadableByteSize?: () => string;
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

    this.children.forEach(childItem => {
      childItem.isFile = () => childItem.type === "file";
      childItem.isFolder = () => childItem.type === "directory";
      childItem.humanReadableByteSize = () =>
        childItem?.sizeBytes ? fileSize(childItem.sizeBytes) : "";
    });
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
  public readonly children?: IChildren[];
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

  public isFile(): boolean {
    return this.type === "file";
  }

  public isFolder(): boolean {
    return this.type === "directory";
  }

  public humanReadableByteSize(): string {
    return this?.sizeBytes ? fileSize(this.sizeBytes) : "";
  }

  public get viewUrl(): string {
    throw new Error("AnalysisJobItemResult viewUrl not implemented.");
  }
}
