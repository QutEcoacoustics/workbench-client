import { Injectable } from "@angular/core";
import { BawSessionService } from "@baw-api/baw-session.service";
import { toSnakeCase } from "@helpers/case-converter/case-converter";
import { toBase64Url } from "@helpers/encoding/encoding";
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
  ReadonlyApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const audioRecordingId: IdParamOptional<AudioRecording> = id;
const endpoint = stringTemplate`/audio_recordings/${audioRecordingId}${option}`;
const downloadEndpoint = stringTemplate`/audio_recordings/downloader`;
/**
 * Path to download original audio recording. This currently requires the
 * apiRoot to be prepended to the endpoint
 * TODO This should be an absolute path
 */
export const audioRecordingOriginalEndpoint = stringTemplate`/audio_recordings/${audioRecordingId}/original`;

@Injectable()
export class AudioRecordingsService implements ReadonlyApi<AudioRecording> {
  public constructor(
    private api: BawApiService<AudioRecording>,
    private session: BawSessionService
  ) {}

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
   * @param project Project to filter by
   */
  public filterByHarvest(
    filters: Filters<AudioRecording>,
    harvest: IdOr<Harvest>
  ): Observable<AudioRecording[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "harvests.id" as any, harvest)
    );
  }

  public downloadUrl(audioRecording: IdOr<AudioRecording>) {
    return this.api.getPath(audioRecordingOriginalEndpoint(audioRecording));
  }

  /**
   * Returns a link to the API which will download a templated script for downloading original audio files
   *
   * @param filter Audio recording filters
   */
  public batchDownloadUrl(filter: Filters<AudioRecording>): string {
    // TODO Implement logic from sites downloadAnnotations function
    // TODO Extract this logic with URLSearchParams to some core functionality
    let body = {
      // Base64 RFC 4648 §5 encoding
      filterEncoded: toBase64Url(JSON.stringify(toSnakeCase(filter))),
    };

    if (this.session.isLoggedIn) {
      body["authToken"] = this.session.authToken;
    }

    body = toSnakeCase(body);

    const qsp = new URLSearchParams(body);
    return this.api.getPath(downloadEndpoint()) + "?" + qsp.toString();
  }
}

export const audioRecordingResolvers = new Resolvers<AudioRecording, []>(
  [AudioRecordingsService],
  "audioRecordingId"
).create("AudioRecording");
