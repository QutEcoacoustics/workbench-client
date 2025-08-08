import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Injectable } from "@angular/core";
import { AudioEvent } from "@models/AudioEvent";
import { Tagging } from "@models/Tagging";
import { Observable } from "rxjs";
import { AudioRecording } from "@models/AudioRecording";
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

const audioRecordingId: IdParam<AudioRecording> = id;
const audioEventId: IdParam<AudioEvent> = id;
const taggingId: IdParamOptional<Tagging> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}/taggings/${taggingId}${option}`;

@Injectable()
export class TaggingsService
  implements StandardApi<Tagging, [IdOr<AudioRecording>, IdOr<AudioEvent>]>
{
  public constructor(private api: BawApiService<Tagging>) {}

  public list(
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging[]> {
    return this.api.list(
      Tagging,
      endpoint(audioRecording, audioEvent, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<Tagging>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging[]> {
    return this.api.filter(
      Tagging,
      endpoint(audioRecording, audioEvent, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<Tagging>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.api.show(
      Tagging,
      endpoint(audioRecording, audioEvent, model, emptyParam)
    );
  }

  public create(
    model: Tagging,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.api.create(
      Tagging,
      endpoint(audioRecording, audioEvent, emptyParam, emptyParam),
      (tagging) => endpoint(audioRecording, audioEvent, tagging, emptyParam),
      model
    );
  }

  public update(
    model: Tagging,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging> {
    return this.api.update(
      Tagging,
      endpoint(audioRecording, audioEvent, model, emptyParam),
      model
    );
  }

  public destroy(
    model: IdOr<Tagging>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<Tagging | void> {
    return this.api.destroy(
      endpoint(audioRecording, audioEvent, model, emptyParam)
    );
  }
}

export const taggingResolvers = new Resolvers<
  Tagging,
  [IdOr<AudioRecording>, IdOr<AudioEvent>]
>([TaggingsService], "taggingId", ["audioRecordingId", "audioEventId"]).create(
  "Tagging"
);
