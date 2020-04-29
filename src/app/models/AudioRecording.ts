import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { Duration } from "luxon";
import { Observable } from "rxjs";
import { DateTimeTimezone, Id, Uuid } from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawDateTime,
  BawDuration,
  HasOne,
} from "./AbstractModel";
import type { Site } from "./Site";
import type { User } from "./User";

/**
 * An audio recording model
 */
export interface IAudioRecording {
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
  status?: Status;
  notes?: Blob | any;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
  originalFileName?: string;
  recordedUtcOffset?: string;
}

/**
 * An audio recording model
 */
export class AudioRecording extends AbstractModel implements IAudioRecording {
  public readonly kind: "AudioRecording" = "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  @BawDuration({ key: "durationSeconds" })
  public readonly duration: Duration;
  public readonly durationSeconds?: number;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: number;
  public readonly fileHash?: string;
  public readonly status?: Status;
  public readonly notes?: Blob;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly originalFileName?: string;
  public readonly recordedUtcOffset?: string;

  // Associations
  @HasOne(ACCOUNT, (m: AudioRecording) => m.uploaderId)
  public uploader?: Observable<User>;
  @HasOne(SHALLOW_SITE, (m: AudioRecording) => m.siteId)
  public site?: Observable<Site>;
  @HasOne(ACCOUNT, (m: AudioRecording) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioRecording) => m.updaterId)
  public updater?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioRecording) => m.deleterId)
  public deleter?: Observable<User>;

  constructor(audioRecording: IAudioRecording) {
    super(audioRecording);
  }

  public get viewUrl(): string {
    throw new Error("AudioRecording viewUrl not implemented.");
  }
}

type Status =
  | "new"
  | "uploading"
  | "to_check"
  | "ready"
  | "corrupt"
  | "aborted";
