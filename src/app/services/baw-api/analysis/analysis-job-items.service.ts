import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItem, IAnalysisJobItem } from "@models/AnalysisJobItem";
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
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const analysisJobId: IdParam<AnalysisJob> = id;
const analysisJobItemId: IdParamOptional<AnalysisJobItem> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}/audio_recordings/${analysisJobItemId}${option}`;

@Injectable()
export class AnalysisJobItemsService extends ReadonlyApi<
  AnalysisJobItem,
  [IdOr<AnalysisJob>]
> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AnalysisJobItem, injector);
  }

  public list(analysisJob: IdOr<AnalysisJob>): Observable<AnalysisJobItem[]> {
    return this.apiList(endpoint(analysisJob, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<IAnalysisJobItem>,
    analysisJob: IdOr<AnalysisJob>
  ): Observable<AnalysisJobItem[]> {
    return this.apiFilter(
      endpoint(analysisJob, emptyParam, filterParam),
      filters
    );
  }
  public show(
    model: IdOr<AnalysisJobItem>,
    analysisJob: IdOr<AnalysisJob>
  ): Observable<AnalysisJobItem> {
    return this.apiShow(endpoint(analysisJob, model, emptyParam));
  }
}

export const analysisJobItemResolvers = new Resolvers<
  AnalysisJobItem,
  [IdOr<AnalysisJob>],
  AnalysisJobItemsService
>([AnalysisJobItemsService], "analysisJobItemId", ["analysisJobId"]).create(
  "AnalysisJobItem"
);
