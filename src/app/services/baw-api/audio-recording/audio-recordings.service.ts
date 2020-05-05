import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { filterMock, showMock } from "@baw-api/mock/api-commonMock";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Id } from "@interfaces/apiInterfaces";
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
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioRecording, injector);
  }

  list(): Observable<AudioRecording[]> {
    return this.filter({});
    //return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<AudioRecording[]> {
    return filterMock(filters, (modelId) =>
      createAudioRecording(modelId, this.injector)
    );
    //return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<AudioRecording>): Observable<AudioRecording> {
    return showMock(model, (modelId) =>
      createAudioRecording(modelId, this.injector)
    );
    //return this.apiShow(endpoint(model, Empty));
  }
}

export const audioRecordingResolvers = new Resolvers<
  AudioRecording,
  AudioRecordingsService
>([AudioRecordingsService], "audioRecordingId").create("AudioRecording");

function createAudioRecording(modelId: Id, injector: Injector) {
  return new AudioRecording(
    {
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
      notes: {
        relative_path: "ULI25_NEW/Data/ULI25_20190909_043707.wav",
        duration_adjustment_for_overlap: [
          {
            changed_at: "2020-02-04T04:59:16Z",
            overlap_amount: 2.978,
            old_duration: 3597.978,
            new_duration: 3595.0,
            other_uuid: "938742fc-3fcc-4ba0-85ed-d4137e5079be",
          },
        ],
      },
      creatorId: 1,
      updaterId: 7,
      createdAt: "2018-01-16T10:36:45.801+10:00",
      updatedAt: "2018-01-16T10:36:46.539+10:00",
    },
    injector
  );
}
