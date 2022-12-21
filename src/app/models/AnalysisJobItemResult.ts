import { Injector } from "@angular/core";
import { Id, Param } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { AnalysisJob } from "./AnalysisJob";
import { AudioRecording } from "./AudioRecording";

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
  public analysisJob?: AnalysisJob;
  public audioRecording?: AudioRecording;

  public get viewUrl(): string {
    throw new Error("AnalysisJobItemResult viewUrl not implemented.");
  }

  public downloadUrl(apiRoot: string): string {
    return apiRoot + this.path;
  }
}

export class AnalysisJobItemResultViewModel extends AnalysisJobItemResult {
  public open?: boolean;
}
