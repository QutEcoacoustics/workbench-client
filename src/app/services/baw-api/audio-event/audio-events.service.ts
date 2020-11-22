import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent, IAudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { User } from "@models/User";
import { Observable } from "rxjs";
import {
  ApiFilter,
  Empty,
  Filter,
  filterByForeignKey,
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
const audioEventId: IdParamOptional<AudioEvent> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}${option}`;
const shallowEndpoint = stringTemplate`/audio_events/${audioEventId}${option}`;

@Injectable()
export class AudioEventsService extends StandardApi<
  AudioEvent,
  [IdOr<AudioRecording>]
> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioEvent, injector);
  }

  public list(audioRecording: IdOr<AudioRecording>): Observable<AudioEvent[]> {
    return this.apiList(endpoint(audioRecording, Empty, Empty));
  }
  public filter(
    filters: Filters<IAudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent[]> {
    return this.apiFilter(endpoint(audioRecording, Empty, Filter), filters);
  }
  public show(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiShow(endpoint(audioRecording, model, Empty));
  }
  public create(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiCreate(endpoint(audioRecording, Empty, Empty), model);
  }
  public update(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiUpdate(endpoint(audioRecording, model, Empty), model);
  }
  public destroy(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent | void> {
    return this.apiDestroy(endpoint(audioRecording, model, Empty));
  }
}

@Injectable()
export class ShallowAudioEventsService
  extends BawApiService<AudioEvent>
  implements ApiFilter<AudioEvent> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioEvent, injector);
  }

  public filter(filters: Filters<IAudioEvent>): Observable<AudioEvent[]> {
    return this.apiFilter(shallowEndpoint(Empty, Filter), filters);
  }

  public filterByCreator(filters: Filters<IAudioEvent>, user?: IdOr<User>) {
    return this.filter(
      user
        ? filterByForeignKey<IAudioEvent>(filters, "creatorId", user)
        : filters
    );
  }
}

export const audioEventResolvers = new Resolvers<
  AudioEvent,
  AudioEventsService
>([AudioEventsService], "audioEventId", ["audioRecordingId"]).create(
  "AudioEvent"
);
