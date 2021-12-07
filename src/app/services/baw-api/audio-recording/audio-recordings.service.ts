import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioRecording } from "@models/AudioRecording";
import type { Region } from "@models/Region";
import type { Site } from "@models/Site";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  isId,
  option,
  ReadonlyApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const audioRecordingId: IdParamOptional<AudioRecording> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}${option}`;
/**
 * Path to download original audio recording. This currently requires the
 * apiRoot to be prepended to the endpoint
 * TODO This should be an absolute path
 */
export const audioRecordingOriginalEndpoint = stringTemplate`/audio_recordings/${audioRecordingId}/original`;

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
    filters: Filters<AudioRecording>
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
  public filterBySite(filters: Filters<AudioRecording>, site: IdOr<Site>) {
    return this.filter(
      this.filterThroughAssociation(filters, "siteId", site) as Filters
    );
  }

  /**
   * Filter audio recordings by region id. For better performance
   * provide the region model instead of id
   *
   * @param filters Audio recording filters
   * @param region Region to filter by
   */
  public filterByRegion(
    filters: Filters<AudioRecording>,
    region: IdOr<Region>
  ) {
    if (isId(region)) {
      return this.filterThroughAssociation(
        filters,
        "sites.regionId" as any,
        region
      );
    }

    // If we know the site ids, no need to make unnecessary db request
    return this.filter(
      this.filterThroughAssociations(
        filters,
        "siteId",
        Array.from(region.siteIds)
      ) as Filters
    );
  }
}

export const audioRecordingResolvers = new Resolvers<AudioRecording, []>(
  [AudioRecordingsService],
  "audioRecordingId"
).create("AudioRecording");
