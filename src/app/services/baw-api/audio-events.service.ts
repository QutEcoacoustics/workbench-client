import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEvent } from "@models/AudioEvent";
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
const audioEventId: IdParamOptional<AudioEvent> = id;
const endpoint = stringTemplate`/analysis_jobs/${analysisJobId}/audio_events/${audioEventId}${option}`;

@Injectable()
export class AudioEventsService extends StandardApi<
  AudioEvent,
  [IdOr<AnalysisJob>]
> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, AudioEvent);
  }

  list(analysis: IdOr<AnalysisJob>): Observable<AudioEvent[]> {
    return this.apiList(endpoint(analysis, Empty, Empty));
  }
  filter(
    filters: Filters,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEvent[]> {
    return this.apiFilter(endpoint(analysis, Empty, Filter), filters);
  }
  show(
    model: IdOr<AudioEvent>,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEvent> {
    return this.apiShow(endpoint(analysis, model, Empty));
  }
  create(
    model: AudioEvent,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEvent> {
    return this.apiCreate(endpoint(analysis, Empty, Empty), model);
  }
  update(
    model: AudioEvent,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEvent> {
    return this.apiUpdate(endpoint(analysis, model, Empty), model);
  }
  destroy(
    model: IdOr<AudioEvent>,
    analysis: IdOr<AnalysisJob>
  ): Observable<AudioEvent | void> {
    return this.apiDestroy(endpoint(analysis, model, Empty));
  }
}

export const audioEventResolvers = new Resolvers<
  AudioEvent,
  AudioEventsService
>([AudioEventsService], "audioEventId", ["analysisJobId"]).create("AudioEvent");
