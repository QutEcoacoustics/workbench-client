import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioEvent } from "@models/AudioEvent";
import { AudioEventTag, IAudioEventTag } from "@models/AudioEventTag";
import { AudioRecording } from "@models/AudioRecording";
import { Observable } from "rxjs";
import { ApiFilter, Filter, id, IdOr, IdParam, option } from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";

const audioRecordingId: IdParam<AudioRecording> = id;
const audioEventId: IdParam<AudioEvent> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}/audio_events/${audioEventId}/tags/${option}`;

@Injectable()
export class AudioEventTagsService extends BawApiService<AudioEventTag>
  implements
    ApiFilter<AudioEventTag, [IdOr<AudioRecording>, IdOr<AudioEvent>]> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioEventTag, injector);
  }

  filter(
    filters: Filters<IAudioEventTag>,
    audioRecording: IdOr<AudioRecording>,
    audioEvent: IdOr<AudioEvent>
  ): Observable<AudioEventTag[]> {
    return this.apiFilter(
      endpoint(audioRecording, audioEvent, Filter),
      filters
    );
  }
}
