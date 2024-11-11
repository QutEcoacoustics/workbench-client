import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioEvent } from "@models/AudioEvent";
import { Tagging } from "@models/Tagging";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const analysisJobId: IdParam<AnalysisJob> = id;
const audioEventId: IdParam<AudioEvent> = id;
const taggingId: IdParamOptional<Tagging> = id;
const endpoint = stringTemplate`/audio_recordings/${analysisJobId}/audio_events/${audioEventId}/taggings/${taggingId}${option}`;

@Injectable()
export class TaggingsService
  implements StandardApi<Tagging, [IdOr<AnalysisJob>, IdOr<AudioEvent>]>
{
  public constructor(private api: BawApiService<Tagging>) {}

  public list(
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging[]> {
    return this.api.list(
      Tagging,
      endpoint(analysisJob, audioEvent, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<Tagging>,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging[]> {
    return this.api.filter(
      Tagging,
      endpoint(analysisJob, audioEvent, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<Tagging>,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.api.show(
      Tagging,
      endpoint(analysisJob, audioEvent, model, emptyParam)
    );
  }

  public create(
    model: Tagging,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.api.create(
      Tagging,
      endpoint(analysisJob, audioEvent, emptyParam, emptyParam),
      (tagging) => endpoint(analysisJob, audioEvent, tagging, emptyParam),
      model
    );
  }

  public update(
    model: Tagging,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.api.update(
      Tagging,
      endpoint(analysisJob, audioEvent, model, emptyParam),
      model
    );
  }

  public destroy(
    model: IdOr<Tagging>,
    analysisJob: IdOr<AnalysisJob>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging | void> {
    return this.api.destroy(
      endpoint(analysisJob, audioEvent, model, emptyParam)
    );
  }
}

export const taggingResolvers = new Resolvers<
  Tagging,
  [IdOr<AnalysisJob>, IdOr<AudioEvent>]
>([TaggingsService], "taggingId", ["analysisJobId", "audioEventId"]).create(
  "Tagging"
);
