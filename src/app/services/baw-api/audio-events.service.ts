import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
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

const audioRecordingId: IdParam<AudioRecording> = id;
const audioEventId: IdParamOptional<AudioEvent> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}${option}`;

@Injectable()
export class AudioEventsService extends StandardApi<
  AudioEvent,
  [IdOr<AudioRecording>]
> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, AudioEvent);
  }

  list(audioRecording: IdOr<AudioRecording>): Observable<AudioEvent[]> {
    return this.apiList(endpoint(audioRecording, Empty, Empty));
  }
  filter(
    filters: Filters,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent[]> {
    return this.apiFilter(endpoint(audioRecording, Empty, Filter), filters);
  }
  show(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiShow(endpoint(audioRecording, model, Empty));
  }
  create(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiCreate(endpoint(audioRecording, Empty, Empty), model);
  }
  update(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiUpdate(endpoint(audioRecording, model, Empty), model);
  }
  destroy(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent | void> {
    return this.apiDestroy(endpoint(audioRecording, model, Empty));
  }
}

export const audioEventResolvers = new Resolvers<
  AudioEvent,
  AudioEventsService
>([AudioEventsService], "audioEventId", ["audioRecordingId"]).create(
  "AudioEvent"
);
