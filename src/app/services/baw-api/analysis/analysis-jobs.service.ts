import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawApiStateService } from "@baw-api/baw-api-state.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob, IAnalysisJob } from "@models/AnalysisJob";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  ReadAndUpdateApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const analysisJobId: IdParamOptional<AnalysisJob> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}${option}`;

/**
 * Analysis Jobs Service.
 * Handles API routes pertaining to analysis job models.
 */
@Injectable()
export class AnalysisJobsService extends ReadAndUpdateApi<AnalysisJob> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, AnalysisJob, injector, state);
  }

  public list(): Observable<AnalysisJob[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IAnalysisJob>): Observable<AnalysisJob[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<AnalysisJob>): Observable<AnalysisJob> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public update(model: AnalysisJob): Observable<AnalysisJob> {
    return this.apiUpdate(endpoint(model, emptyParam), model);
  }
}

export const analysisJobResolvers = new Resolvers<AnalysisJob, []>(
  [AnalysisJobsService],
  "analysisJobId"
).create("AnalysisJob");
