import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import {
  Empty,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, showMock } from "./mock/api-commonMock";
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
    return this.filter({});
  }
  filter(filters: Filters): Observable<AudioRecording[]> {
    return filterMock(filters, modelId => createAudioRecording(modelId));
  }
  show(model: IdOr<AudioRecording>): Observable<AudioRecording> {
    return showMock(model, modelId => createAudioRecording(modelId));
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

function createAudioRecording(modelId: Id) {
  return new AudioRecording({
    id: modelId,
    uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    uploaderId: 2,
    recordedDate: "2011-03-24T21:00:00.000+10:00",
    siteId: 1,
    durationSeconds: Math.floor(Math.random() * 7200),
    sampleRateHertz: 44100,
    channels: 2,
    bitRateBps: 1411200,
    mediaType: "audio/wav",
    dataLengthBytes: 1000000,
    fileHash: "SHA: 2346ad27d7568ba9896f1b7da6b5991251debdf2",
    status: "ready",
    notes:
      '{"relative_path"=>"ULI25_NEW/Data/ULI25_20190909_043707.wav", "duration_adjustment_for_overlap"=>[{"changed_at"=>"2020-02-04T04:59:16Z", "overlap_amount"=>2.978, "old_duration"=>3597.978, "new_duration"=>3595.0, "other_uuid"=>"938742fc-3fcc-4ba0-85ed-d4137e5079be"}]}',
    creatorId: 1,
    updaterId: 7,
    createdAt: "2018-01-16T10:36:45.801+10:00",
    updatedAt: "2018-01-16T10:36:46.539+10:00"
  });
}
