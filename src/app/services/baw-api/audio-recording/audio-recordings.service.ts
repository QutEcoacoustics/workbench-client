import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioRecording } from "@models/AudioRecording";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  ReadonlyApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const audioRecordingId: IdParamOptional<AudioRecording> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}${option}`;

@Injectable()
export class AudioRecordingsService extends ReadonlyApi<AudioRecording> {
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
}

export const audioRecordingResolvers = new Resolvers<
  AudioRecording,
  AudioRecordingsService
>([AudioRecordingsService], "audioRecordingId").create("AudioRecording");
