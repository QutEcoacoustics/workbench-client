import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
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
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const audioRecordingId: IdParam<AudioRecording> = id;
const audioEventId: IdParamOptional<AudioEvent> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}${option}`;
const endpointShallow = stringTemplate`/audio_events/${audioEventId}${option}`;

@Injectable()
export class AudioEventsService extends StandardApi<
  AudioEvent,
  [IdOr<AudioRecording>]
> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioEvent, injector);
  }

  list(audioRecording: IdOr<AudioRecording>): Observable<AudioEvent[]> {
    return this.apiList(endpoint(audioRecording, Empty, Empty));
  }
  filter(
    filters: Filters<IAudioEvent>,
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

// TODO https://github.com/QutEcoacoustics/baw-server/issues/454
@Injectable()
export class ShallowAudioEventsService extends StandardApi<AudioEvent> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioEvent, injector);
  }

  list(): Observable<AudioEvent[]> {
    return this.apiList(endpointShallow(Empty, Empty));
  }
  filter(filters: Filters<IAudioEvent>): Observable<AudioEvent[]> {
    return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  show(model: IdOr<AudioEvent>): Observable<AudioEvent> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  create(model: AudioEvent): Observable<AudioEvent> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  update(model: AudioEvent): Observable<AudioEvent> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  destroy(model: IdOr<AudioEvent>): Observable<AudioEvent | void> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}

export const audioEventResolvers = new Resolvers<
  AudioEvent,
  AudioEventsService
>([AudioEventsService], "audioEventId", ["audioRecordingId"]).create(
  "AudioEvent"
);

export const shallowAudioEventResolvers = new Resolvers<
  AudioEvent,
  ShallowAudioEventsService
>([ShallowAudioEventsService], "audioEventId").create("ShallowAudioEvent");
