import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  IdOr,
  id,
  IdParamOptional,
  option,
  ReadonlyApi,
  param,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
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

@Injectable()
export class AnalysisJobItemResultsService
  implements
    ReadonlyApi<
      AnalysisJobItemResult,
      [IdOr<AnalysisJob>, IdOr<AudioRecording>]
    >
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

  public filter(
    filters: Filters<AnalysisJobItemResult>,
    analysisJob: IdOr<AnalysisJob>,
    audioRecording: IdOr<AudioRecording>,
    // TODO: we should consider overloads that take a path or model
    analysisJobItemResult?: AnalysisJobItemResult
  ): Observable<AnalysisJobItemResult[]> {
    return this.api.filter(
      AnalysisJobItemResult,
      analysisJobItemResultsEndpoint(
        analysisJob,
        audioRecording,
        analysisJobItemResult?.name ?? emptyParam,
        filterParam
      ),
      filters
    );
  }

  public show(
    analysisJobItemResult: AnalysisJobItemResult,
    analysisJob: IdOr<AnalysisJob>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AnalysisJobItemResult>;
  // public show(
  //   analysisJobItemResultPath: string
  // ): Observable<AnalysisJobItemResult>;

  public show(
    analysisJobItemResult: AnalysisJobItemResult,
    analysisJob?: IdOr<AnalysisJob>,
    audioRecording?: IdOr<AudioRecording>
  ): Observable<AnalysisJobItemResult> {
    if (analysisJobItemResult?.path) {
      const adjustedPath = analysisJobItemResult.path.replace("http://api.staging.ecosounds.org", "");
      return this.api.show(AnalysisJobItemResult, adjustedPath);
    }

    return this.api.show(
      AnalysisJobItemResult,
      analysisJobItemResultsEndpoint(
        analysisJob,
        audioRecording,
        analysisJobItemResult?.name ?? emptyParam,
        emptyParam
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
