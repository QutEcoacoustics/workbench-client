import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEvent } from "@models/AudioEvent";
import { ITagging, Tagging } from "@models/Tagging";
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
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const analysisJobId: IdParam<AnalysisJob> = id;
const audioEventId: IdParam<AudioEvent> = id;
const taggingId: IdParamOptional<Tagging> = id;
const endpoint = stringTemplate`/audio_recordings/${analysisJobId}/audio_events/${audioEventId}/taggings/${taggingId}${option}`;

@Injectable()
export class TaggingsService extends StandardApi<
  Tagging,
  [IdOr<AnalysisJob>, IdOr<AudioEvent>]
> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Tagging, injector);
  }

  public list(
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging[]> {
    return this.apiList(endpoint(analysisJob, audioEvent, Empty, Empty));
  }
  public filter(
    filters: Filters<ITagging>,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging[]> {
    return this.apiFilter(
      endpoint(analysisJob, audioEvent, Empty, Filter),
      filters
    );
  }
  public show(
    model: IdOr<Tagging>,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.apiShow(endpoint(analysisJob, audioEvent, model, Empty));
  }
  public create(
    model: Tagging,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.apiCreate(
      endpoint(analysisJob, audioEvent, Empty, Empty),
      model
    );
  }
  public update(
    model: Tagging,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.apiUpdate(
      endpoint(analysisJob, audioEvent, model, Empty),
      model
    );
  }
  public destroy(
    model: IdOr<Tagging>,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging | void> {
    return this.apiDestroy(endpoint(analysisJob, audioEvent, model, Empty));
  }
}

export const taggingResolvers = new Resolvers<Tagging, TaggingsService>(
  [TaggingsService],
  "taggingId",
  ["analysisJobId", "audioEventId"]
).create("Tagging");
