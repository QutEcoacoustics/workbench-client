import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const analysisJobId: IdParamOptional<AnalysisJob> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}${option}`;

/**
 * Analysis Jobs Service.
 * Handles API routes pertaining to analysis job models.
 */
@Injectable()
export class AnalysisJobsService extends StandardApi<AnalysisJob, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, AnalysisJob);
  }

  list(): Observable<AnalysisJob[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<AnalysisJob[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<AnalysisJob>): Observable<AnalysisJob> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: AnalysisJob): Observable<AnalysisJob> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: AnalysisJob): Observable<AnalysisJob> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<AnalysisJob>): Observable<AnalysisJob | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const analysisJobResolvers = new Resolvers<
  AnalysisJob,
  AnalysisJobsService
>([AnalysisJobsService], "analysisJobId").create("AnalysisJob");
