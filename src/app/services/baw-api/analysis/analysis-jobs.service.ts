import { Injectable } from "@angular/core";
import { ShowDefaultResolver } from "@baw-api/ShowDefaultResolver";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
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
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const analysisJobId: IdParamOptional<AnalysisJob> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}${option}`;

/**
 * Analysis Jobs Service.
 * Handles API routes pertaining to analysis job models.
 */
@Injectable()
export class AnalysisJobsService implements ReadAndUpdateApi<AnalysisJob> {
  public constructor(private api: BawApiService<AnalysisJob>) {}

  public list(): Observable<AnalysisJob[]> {
    return this.api.list(AnalysisJob, endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<AnalysisJob>): Observable<AnalysisJob[]> {
    return this.api.filter(
      AnalysisJob,
      endpoint(emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<AnalysisJob>): Observable<AnalysisJob> {
    return this.api.show(AnalysisJob, endpoint(model, emptyParam));
  }
  public update(model: AnalysisJob): Observable<AnalysisJob> {
    return this.api.update(AnalysisJob, endpoint(model, emptyParam), model);
  }
}

// TODO: Remove this hard coded system analysis job.
// At the moment, there is a bug in the API where the system job does not exist in the database and will not be returned when requested.
// This systemAnalysisJob is a workaround that can be used on if the route data returns null & is requesting the system analysis job.
export const systemAnalysisJob: AnalysisJob = new AnalysisJob({ id: "system", name: "system" });

const defaultAnalysisJobResolver = new ShowDefaultResolver<
  AnalysisJob,
  [],
  AnalysisJobsService
>([AnalysisJobsService], null).create("AnalysisJob");

export const analysisJobResolvers = new Resolvers<AnalysisJob, []>(
  [AnalysisJobsService],
  "analysisJobId"
).create("AnalysisJob", defaultAnalysisJobResolver);
