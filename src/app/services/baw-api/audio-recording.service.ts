import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { AudioRecording } from "src/app/models/AudioRecording";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  StandardApi,
  option
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const audioRecordingId: IdParamOptional<AudioRecording> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}${option}`;

/**
 * Audio Recordings Service.
 * Handles API routes pertaining to audio recordings
 */
@Injectable()
export class AudioRecordingService extends StandardApi<AudioRecording, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, AudioRecording);
  }

  list(): Observable<AudioRecording[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<AudioRecording[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<AudioRecording>): Observable<AudioRecording> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: AudioRecording): Observable<AudioRecording> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: AudioRecording): Observable<AudioRecording> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<AudioRecording>): Observable<AudioRecording | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const audioRecordingResolvers = new Resolvers<
  AudioRecording,
  AudioRecordingService
>([AudioRecordingService], "audioRecordingId").create("AudioRecording");
