import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItem } from "@models/AnalysisJobItem";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  ReadonlyApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const analysisJobId: IdParam<AnalysisJob> = id;
const analysisJobItemId: IdParamOptional<AnalysisJobItem> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}/audio_recordings/${analysisJobItemId}${option}`;

@Injectable()
export class AnalysisJobItemsService
  implements ReadonlyApi<AnalysisJobItem, [IdOr<AnalysisJob>]>
{
  public constructor(private api: BawApiService<AnalysisJobItem>) {}

  public list(analysisJob: IdOr<AnalysisJob>): Observable<AnalysisJobItem[]> {
    return this.api.list(
      AnalysisJobItem,
      endpoint(analysisJob, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<AnalysisJobItem>,
    analysisJob: IdOr<AnalysisJob>
  ): Observable<AnalysisJobItem[]> {
    return this.api.filter(
      AnalysisJobItem,
      endpoint(analysisJob, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<AnalysisJobItem>,
    analysisJob: IdOr<AnalysisJob>
  ): Observable<AnalysisJobItem> {
    return this.api.show(
      AnalysisJobItem,
      endpoint(analysisJob, model, emptyParam)
    );
  }
}

export const analysisJobItemResolvers = new Resolvers<
  AnalysisJobItem,
  [IdOr<AnalysisJob>]
>([AnalysisJobItemsService], "analysisJobItemId", ["analysisJobId"]).create(
  "AnalysisJobItem"
);
