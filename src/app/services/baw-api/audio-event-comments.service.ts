import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEventComment } from "@models/AudioEventComment";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const analysisJobId: IdParam<AnalysisJob> = id;
const audioEventCommentId: IdParamOptional<AudioEventComment> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}/comments/${audioEventCommentId}${option}`;

@Injectable()
export class AudioEventCommentsService extends StandardApi<
  AudioEventComment,
  [IdOr<AnalysisJob>]
> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, AudioEventComment);
  }

  list(analysis: IdOr<AnalysisJob>): Observable<AudioEventComment[]> {
    return this.apiList(endpoint(analysis, Empty, Empty));
  }
  filter(
    filters: Filters,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEventComment[]> {
    return this.apiFilter(endpoint(analysis, Empty, Filter), filters);
  }
  show(
    model: IdOr<AudioEventComment>,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEventComment> {
    return this.apiShow(endpoint(analysis, model, Empty));
  }
  create(
    model: AudioEventComment,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEventComment> {
    return this.apiCreate(endpoint(analysis, Empty, Empty), model);
  }
  update(
    model: AudioEventComment,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEventComment> {
    return this.apiUpdate(endpoint(analysis, model, Empty), model);
  }
  destroy(
    model: IdOr<AudioEventComment>,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEventComment | void> {
    return this.apiDestroy(endpoint(analysis, model, Empty));
  }
}

export const audioEventCommentResolvers = new Resolvers<
  AudioEventComment,
  AudioEventCommentsService
>([AudioEventCommentsService], "audioEventCommentId", ["analysisJobId"]).create(
  "AudioEventComment"
);
