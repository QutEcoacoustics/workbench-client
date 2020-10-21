import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob, IAnalysisJob } from "@models/AnalysisJob";
import { generateAnalysisJob } from "@test/fakes/AnalysisJob";
import { BehaviorSubject, Observable } from "rxjs";
import {
  Empty,
  Filter,
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
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AnalysisJob, injector);
  }

  public list(): Observable<AnalysisJob[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  public filter(filters: Filters<IAnalysisJob>): Observable<AnalysisJob[]> {
    const response = [];
    for (let i = 0; i < 25; i++) {
      const job = new AnalysisJob(generateAnalysisJob(i), this.injector);
      job.addMetadata({
        paging: {
          page: filters?.paging?.page || 1,
          total: 100,
          items: 25,
          maxPage: 4,
        },
      });
      response.push(job);
    }
    return new BehaviorSubject(response);
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  public show(model: IdOr<AnalysisJob>): Observable<AnalysisJob> {
    return new BehaviorSubject(
      new AnalysisJob(generateAnalysisJob(parseInt(id(model))), this.injector)
    );
    return this.apiShow(endpoint(model, Empty));
  }
  public update(model: AnalysisJob): Observable<AnalysisJob> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
}

export const analysisJobResolvers = new Resolvers<
  AnalysisJob,
  AnalysisJobsService
>([AnalysisJobsService], "analysisJobId").create("AnalysisJob");
