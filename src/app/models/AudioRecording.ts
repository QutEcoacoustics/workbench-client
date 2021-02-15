import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
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
import { bawDateTime, bawDuration } from "./AttributeDecorators";
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
  recordedUtcOffset?: string;
}

/**
 * An audio recording model
 */
export class AudioRecording extends AbstractModel implements IAudioRecording {
  public readonly kind = "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  @bawDateTime()
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  @bawDuration<AudioRecording>({ key: "durationSeconds" })
  public readonly duration: Duration;
  public readonly durationSeconds?: number;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: number;
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
  public readonly recordedUtcOffset?: string;

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

  public constructor(audioRecording: IAudioRecording, injector?: Injector) {
    super(audioRecording, injector);
  }

  public get viewUrl(): string {
    return listenRecordingMenuItem.route.format({ audioRecordingId: this.id });
  }
}

export type AudioRecordingStatus =
  | "new"
  | "uploading"
  | "to_check"
  | "ready"
  | "corrupt"
  | "aborted";
