import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { Observable } from "rxjs";
import {
  ApiFilter,
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
    return this.apiList(endpoint(audioRecording, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent[]> {
    return this.apiFilter(
      endpoint(audioRecording, emptyParam, filterParam),
      filters
    );
  }
  public show(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiShow(endpoint(audioRecording, model, emptyParam));
  }
  public create(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiCreate(
      endpoint(audioRecording, emptyParam, emptyParam),
      model
    );
  }
  public update(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.apiUpdate(endpoint(audioRecording, model, emptyParam), model);
  }
  public destroy(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent | void> {
    return this.apiDestroy(endpoint(audioRecording, model, emptyParam));
  }
}

@Injectable()
export class ShallowAudioEventsService
  extends BawApiService<AudioEvent>
  implements ApiFilter<AudioEvent>
{
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioEvent, injector);
  }

  public filter(filters: Filters<AudioEvent>): Observable<AudioEvent[]> {
    return this.apiFilter(shallowEndpoint(emptyParam, filterParam), filters);
  }

  /**
   * Filter audio events by creator id
   *
   * @param filters Audio event filters
   * @param user User to filter by
   */
  public filterByCreator(
    filters: Filters<AudioEvent>,
    user: IdOr<User>
  ): Observable<AudioEvent[]> {
    return this.filter(
      this.filterThroughAssociation(filters, "creatorId", user)
    );
  }

  /**
   * Filter audio events by site id
   *
   * @param filters Audio event filters
   * @param site Site to filter by
   */
  public filterBySite(
    filters: Filters<AudioEvent>,
    site: IdOr<Site>
  ): Observable<AudioEvent[]> {
    return this.filter(
      this.filterThroughAssociation(
        filters,
        "audio_recordings.site_id" as any,
        site
      )
    );
  }
}

export const audioEventResolvers = new Resolvers<
  AudioEvent,
  [IdOr<AudioRecording>]
>([AudioEventsService], "audioEventId", ["audioRecordingId"]).create(
  "AudioEvent"
);
