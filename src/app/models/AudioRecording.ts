import { id, IdOr } from "@baw-api/api-common";
import {
  audioRecordingOriginalEndpoint,
  audioRecordingMediaEndpoint,
} from "@baw-api/audio-recording/audio-recordings.service";
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
  HasLicense,
  Id,
  Uuid,
} from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  isUnresolvedModel,
  UnresolvedModel,
} from "./AbstractModel";
import { creator, deleter, hasOne, updater } from "./AssociationDecorators";
import {
  bawBytes,
  bawDateTime,
  bawDuration,
  bawReadonlyConvertCase,
} from "./AttributeDecorators";
import { Project } from "./Project";
import { Region } from "./Region";
import type { Site } from "./Site";
import type { User } from "./User";
import { AssociationInjector } from "./ImplementsInjector";

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
  implements IAudioRecording, HasLicense
{
  public readonly kind = "Audio Recording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  @bawDateTime(undefined, "recordedDateTimezone")
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
  @bawReadonlyConvertCase()
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

  public constructor(data: IAudioRecording, injector?: AssociationInjector) {
    super(data, injector);

    // TODO Remove this, and replace with solution for #1815
    // Set timezone on recorded date
    if (this.recordedDateTimezone) {
      this.recordedDate = this.recordedDate.setZone(this.recordedDateTimezone);
    }
  }

  public get license(): string | undefined {
    return this.site?.projects[0]?.license;
  }

  /** Routes to the download link for the api */
  public getDownloadUrl(apiRoot: string): string {
    return apiRoot + audioRecordingOriginalEndpoint(this.id);
  }

  /**
   * An api endpoint that can be used to split media using start_offset and
   * end_offset url parameters
   */
  public getMediaUrl(apiRoot: string): string {
    return (
      apiRoot + audioRecordingMediaEndpoint(this.id, this.originalFileExtension)
    );
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

  public get originalFileExtension(): string {
    return this.originalFileName?.split(".").pop() ?? "";
  }

  /** Routes to the details page relative to the parent models */
  public getDetailsUrl(
    project?: IdOr<Project | UnresolvedModel>,
    region?: IdOr<Region | UnresolvedModel>,
    site?: IdOr<Site | UnresolvedModel>
  ): string {
    function ensureResolvedId<T extends AbstractModel>(
      model: IdOr<T | UnresolvedModel>
    ): IdOr<T> | null {
      if (typeof model === "number" || !isUnresolvedModel(model)) {
        return model;
      }
      return null;
    }

    const routes = audioRecordingRoutes;
    return this.selectRoute(
      routes,
      ensureResolvedId(project),
      ensureResolvedId(region),
      ensureResolvedId(site)
    );
  }

  private selectRoute(
    routes: RecordingStrongRoutes,
    project: IdOr<Project>,
    region: IdOr<Region>,
    site: IdOr<Site>
  ): string {
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
  | "toCheck"
  | "ready"
  | "corrupt"
  | "aborted";
