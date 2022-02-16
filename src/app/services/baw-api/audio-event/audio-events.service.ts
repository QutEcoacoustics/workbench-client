import { Injectable } from "@angular/core";
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
export class AudioEventsService
  implements StandardApi<AudioEvent, [IdOr<AudioRecording>]>
{
  public constructor(private api: BawApiService<AudioEvent>) {}

  public list(audioRecording: IdOr<AudioRecording>): Observable<AudioEvent[]> {
    return this.api.list(
      AudioEvent,
      endpoint(audioRecording, emptyParam, emptyParam)
    );
  }
  public filter(
    filters: Filters<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent[]> {
    return this.api.filter(
      AudioEvent,
      endpoint(audioRecording, emptyParam, filterParam),
      filters
    );
  }
  public show(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.api.show(
      AudioEvent,
      endpoint(audioRecording, model, emptyParam)
    );
  }
  public create(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.api.create(
      AudioEvent,
      endpoint(audioRecording, emptyParam, emptyParam),
      (audioEvent) => endpoint(audioRecording, audioEvent, emptyParam),
      model
    );
  }
  public update(
    model: AudioEvent,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent> {
    return this.api.update(
      AudioEvent,
      endpoint(audioRecording, model, emptyParam),
      model
    );
  }
  public destroy(
    model: IdOr<AudioEvent>,
    audioRecording: IdOr<AudioRecording>
  ): Observable<AudioEvent | void> {
    return this.api.destroy(endpoint(audioRecording, model, emptyParam));
  }
}

@Injectable()
export class ShallowAudioEventsService implements ApiFilter<AudioEvent> {
  public constructor(private api: BawApiService<AudioEvent>) {}

  public filter(filters: Filters<AudioEvent>): Observable<AudioEvent[]> {
    return this.api.filter(
      AudioEvent,
      shallowEndpoint(emptyParam, filterParam),
      filters
    );
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
      this.api.filterThroughAssociation(filters, "creatorId", user)
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
      this.api.filterThroughAssociation(
        filters,
        "audioRecordings.siteId" as any,
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
