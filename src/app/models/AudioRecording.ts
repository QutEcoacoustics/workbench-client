import { Injector } from "@angular/core";
import { id, IdOr } from "@baw-api/api-common";
import { audioRecordingOriginalEndpoint } from "@baw-api/audio-recording/audio-recordings.service";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import {
  audioRecordingBatchRoutes,
  audioRecordingRoutes,
  RecordingStrongRoutes,
} from "@components/audio-recordings/audio-recording.routes";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { Duration } from "luxon";
import {
  DateTimeTimezone,
  HasAllUsers,
  Id,
  Uuid,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { creator, deleter, hasOne, updater } from "./AssociationDecorators";
import { bawBytes, bawDateTime, bawDuration } from "./AttributeDecorators";
import { Project } from "./Project";
import { Region } from "./Region";
import type { Site } from "./Site";
import type { User } from "./User";

/**
 * An audio recording model
 */
export interface IAudioRecording extends HasAllUsers {
  id?: Id;
  uuid?: Uuid;
  uploaderId?: Id;
  recordedDate?: DateTimeTimezone | string;
  siteId?: Id;
  durationSeconds?: number;
  sampleRateHertz?: number;
  channels?: number;
  bitRateBps?: number;
  mediaType?: string;
  dataLengthBytes?: number;
  fileHash?: string;
  status?: AudioRecordingStatus;
  notes?: Blob | any;
  originalFileName?: string;
  recordedDateTimezone?: string;
}

/**
 * An audio recording model
 */
export class AudioRecording
  extends AbstractModel<IAudioRecording>
  implements IAudioRecording
{
  public readonly kind = "Audio Recording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  @bawDateTime()
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  @bawDuration<IAudioRecording>({ key: "durationSeconds" })
  public readonly duration?: Duration;
  public readonly durationSeconds?: number;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: number;
  @bawBytes<AudioRecording>({ key: "dataLengthBytes" })
  public readonly dataLength?: string;
  public readonly fileHash?: string;
  public readonly status?: AudioRecordingStatus;
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly originalFileName?: string;
  public readonly recordedDateTimezone?: string;

  // Associations
  @creator<AudioRecording>()
  public creator?: User;
  @updater<AudioRecording>()
  public updater?: User;
  @deleter<AudioRecording>()
  public deleter?: User;
  @hasOne<AudioRecording, User>(ACCOUNT, "uploaderId")
  public uploader?: User;
  @hasOne<AudioRecording, Site>(SHALLOW_SITE, "siteId")
  public site?: Site;

  /** Routes to the play url */
  public get viewUrl(): string {
    return this.playUrl;
  }

  /** Routes to the recording listen page */
  public get playUrl(): string {
    return listenRecordingMenuItem.route.format({ audioRecordingId: this.id });
  }

  public constructor(data: IAudioRecording, injector?: Injector) {
    super(data, injector);

    // TODO Remove this, and replace with solution for #1815
    // Set timezone on recorded date
    if (this.recordedDateTimezone) {
      this.recordedDate = this.recordedDate.setZone(this.recordedDateTimezone);
    }
  }

  /** Routes to the download link for the api */
  public getDownloadUrl(apiRoot: string): string {
    return apiRoot + audioRecordingOriginalEndpoint(this.id);
  }

  /** Routes to the batch download page */
  public getBatchDownloadUrl(
    project?: IdOr<Project>,
    region?: IdOr<Region>,
    site?: IdOr<Site>
  ): string {
    const routes = audioRecordingBatchRoutes;
    return this.selectRoute(routes, project, region, site);
  }

  /** Routes to the base details page */
  public get detailsUrl(): string {
    return this.getDetailsUrl();
  }

  /** Routes to the details page relative to the parent models */
  public getDetailsUrl(
    project?: IdOr<Project>,
    region?: IdOr<Region>,
    site?: IdOr<Site>
  ): string {
    const routes = audioRecordingRoutes;
    return this.selectRoute(routes, project, region, site);
  }

  private selectRoute(
    routes: RecordingStrongRoutes,
    project: IdOr<Project>,
    region: IdOr<Region>,
    site: IdOr<Site>
  ) {
    const routeParams = {
      audioRecordingId: this.id,
      projectId: id(project),
      regionId: id(region),
      siteId: id(site),
    };

    if (site) {
      if (region) {
        return routes.siteAndRegion.format(routeParams);
      } else {
        return routes.site.format(routeParams);
      }
    } else if (region) {
      return routes.region.format(routeParams);
    } else if (project) {
      return routes.project.format(routeParams);
    } else {
      return routes.base.format(routeParams);
    }
  }
}

export type AudioRecordingStatus =
  | "new"
  | "uploading"
  | "to_check"
  | "ready"
  | "corrupt"
  | "aborted";
