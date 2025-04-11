import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { AudioRecording } from "@models/AudioRecording";
import { Harvest } from "@models/Harvest";
import type { Project } from "@models/Project";
import type { Region } from "@models/Region";
import type { Site } from "@models/Site";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  param,
  ReadonlyApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const audioRecordingId: IdParamOptional<AudioRecording> = id;
const fileExtension = param;

const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}${option}`;
const downloadEndpoint = stringTemplate`/audio_recordings/downloader`;

/**
 * Path to download original audio recording. This currently requires the
 * apiRoot to be prepended to the endpoint
 * TODO This should be an absolute path
 */
export const audioRecordingOriginalEndpoint = stringTemplate`/audio_recordings/${audioRecordingId}/original`;

/**
 * A path that can be used to download audio recordings that have been split
 * with start_offset and end_offset url parameters
 */
export const audioRecordingMediaEndpoint = stringTemplate`/audio_recordings/${audioRecordingId}/media.${fileExtension}`;

@Injectable()
export class AudioRecordingsService implements ReadonlyApi<AudioRecording> {
  public constructor(private api: BawApiService<AudioRecording>) {}

  public list(): Observable<AudioRecording[]> {
    return this.api.list(AudioRecording, endpoint(emptyParam, emptyParam));
  }

  public filter(
    filters: Filters<AudioRecording>
  ): Observable<AudioRecording[]> {
    return this.api.filter(
      AudioRecording,
      endpoint(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<AudioRecording>): Observable<AudioRecording> {
    return this.api.show(AudioRecording, endpoint(model, emptyParam));
  }

  /**
   * Filter audio recordings by site id
   *
   * @param filters Audio recording filters
   * @param site Site to filter by
   */
  public filterBySite(
    filters: Filters<AudioRecording>,
    site: IdOr<Site>
  ): Observable<AudioRecording[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "siteId", site)
    );
  }

  /**
   * Filter audio recordings by region id
   *
   * @param filters Audio recording filters
   * @param region Region to filter by
   */
  public filterByRegion(
    filters: Filters<AudioRecording>,
    region: IdOr<Region>
  ): Observable<AudioRecording[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "regions.id" as any, region)
    );
  }

  /**
   * Filter audio recordings by project id
   *
   * @param filters Audio recording filters
   * @param project Project to filter by
   */
  public filterByProject(
    filters: Filters<AudioRecording>,
    project: IdOr<Project>
  ): Observable<AudioRecording[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "projects.id" as any, project)
    );
  }

  /**
   * Filter audio recordings by project id
   *
   * @param filters Audio recording filters
   * @param harvest Harvest to filter by
   */
  public filterByHarvest(
    filters: Filters<AudioRecording>,
    harvest: IdOr<Harvest>
  ): Observable<AudioRecording[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "harvests.id" as any, harvest)
    );
  }

  public downloadUrl(audioRecording: IdOr<AudioRecording>): string {
    return this.api.getPath(audioRecordingOriginalEndpoint(audioRecording));
  }

  public harvestCsvReportUrl(harvest: IdOr<Harvest>): string {
    const filter = this.api.filterThroughAssociation(
      {
        projection: {
          include: [
            "id",
            "siteId",
            "recordedDate",
            "durationSeconds",
            "mediaType",
            "originalFileName",
          ],
        },
      },
      "harvests.id" as any,
      harvest
    );
    return (
      this.api.getPath(endpoint(emptyParam, filterParam) + ".csv?") +
      this.api.encodeFilter(filter, true)
    );
  }

  /**
   * Returns a link to the API which will download a templated script for downloading original audio files
   *
   * @param filter Audio recording filters
   */
  public batchDownloadUrl(filter: Filters<AudioRecording>): string {
    return (
      this.api.getPath(downloadEndpoint() + "?") +
      this.api.encodeFilter(filter, false)
    );
  }
}

export const audioRecordingResolvers = new Resolvers<AudioRecording, []>(
  [AudioRecordingsService],
  "audioRecordingId"
).create("AudioRecording");
