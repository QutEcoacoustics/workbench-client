import { Injectable } from "@angular/core";
import {
  emptyParam,
  IdOr,
  id,
  IdParamOptional,
  option,
  param,
  ApiList,
  ApiShow,
} from "@baw-api/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AnalysisJob } from "@models/AnalysisJob";
import { Observable } from "rxjs";
import { AudioRecording } from "@models/AudioRecording";
import { Resolvers } from "@baw-api/resolver-common";

const analysisJobId: IdParamOptional<AnalysisJob> = id;
const audioRecordingId: IdParamOptional<AudioRecording> = id;
const analysisJobItemResultsPath = param;

const analysisJobItemResultsEndpoint =
  stringTemplate`/analysis_jobs/${analysisJobId}/results/${audioRecordingId}/${analysisJobItemResultsPath}${option}`;

// inner filters are not supported by the AnalysisJobItemResults endpoint
// All pagination and sorting is done through the analysis job list & show body's
@Injectable()
export class AnalysisJobItemResultsService
  implements
    ApiShow<AnalysisJobItemResult, [IdOr<AnalysisJob>, IdOr<AudioRecording>]>,
    ApiList<AnalysisJobItemResult, [IdOr<AnalysisJob>, IdOr<AudioRecording>]>
{
  public constructor(private api: BawApiService<AnalysisJobItemResult>) {}

  public list(
    analysisJob: IdOr<AnalysisJob>,
    audioRecording: IdOr<AudioRecording>,
    // TODO: we should consider overloads that take a path or model
    analysisJobItemResult?: AnalysisJobItemResult
  ): Observable<AnalysisJobItemResult[]> {
    return this.api.list(
      AnalysisJobItemResult,
      analysisJobItemResultsEndpoint(
        analysisJob,
        audioRecording,
        analysisJobItemResult?.name ?? emptyParam,
        emptyParam
      )
    );
  }

  public show(
    analysisJobItemResult: AnalysisJobItemResult,
    analysisJob?: IdOr<AnalysisJob>,
    audioRecording?: IdOr<AudioRecording>
  ): Observable<AnalysisJobItemResult> {
    let options = analysisJobItemResult?.path.split("?", 2)[1] ?? emptyParam;

    if (options !== emptyParam) {
      options = `?${options}`;
    }

    return this.api.show(
      AnalysisJobItemResult,
      analysisJobItemResultsEndpoint(
        analysisJob,
        audioRecording,
        analysisJobItemResult?.name ?? emptyParam,
        options
      )
    );
  }

  public downloadUrl(analysisJobItemResultPath?: string) {
    return this.api.getPath(analysisJobItemResultPath ?? emptyParam);
  }
}

export const analysisJobItemResultResolvers = new Resolvers<
  AnalysisJobItemResult,
  [IdOr<AnalysisJob>, IdOr<AudioRecording>, IdOr<AnalysisJobItemResult>]
>([AnalysisJobItemResultsService], "analysisJobItemResultsPath", [
  "analysisJobId",
  "audioRecordingId",
  "analysisJobItemResultsPath",
]).create("AnalysisJobItemResults");
