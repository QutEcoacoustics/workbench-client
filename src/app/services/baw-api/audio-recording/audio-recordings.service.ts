import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Site } from "@models/Site";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterByForeignKey,
  filterParam,
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
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, AudioRecording, injector);
  }

  public list(): Observable<AudioRecording[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<IAudioRecording>
  ): Observable<AudioRecording[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<AudioRecording>): Observable<AudioRecording> {
    return this.apiShow(endpoint(model, emptyParam));
  }

  /**
   * Filter audio recordings by site id
   *
   * @param filters Audio recording filters
   * @param site Site to filter by
   */
  public filterBySite(filters: Filters<IAudioRecording>, site: IdOr<Site>) {
    return this.apiFilter(
      endpoint(emptyParam, filterParam),
      filterByForeignKey(filters, "siteId", site)
    );
  }
}

export const audioRecordingResolvers = new Resolvers<
  AudioRecording,
  AudioRecordingsService
>([AudioRecordingsService], "audioRecordingId").create("AudioRecording");
