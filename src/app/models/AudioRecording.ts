import { Injector } from "@angular/core";
import { ACCOUNT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { Duration } from "luxon";
import { Observable } from "rxjs";
import { DateTimeTimezone, Id, Uuid } from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  Creator,
  Deleter,
  HasOne,
  Updater,
} from "./AbstractModel";
import { BawDateTime, BawDuration } from "./AttributeDecorators";
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
  @BawDateTime()
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  @BawDuration<AudioRecording>({ key: "durationSeconds" })
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
  @Creator<AudioRecording>()
  public creator?: Observable<User>;
  @Updater<AudioRecording>()
  public updater?: Observable<User>;
  @Deleter<AudioRecording>()
  public deleter?: Observable<User>;
  @HasOne(ACCOUNT, (m: AudioRecording) => m.uploaderId)
  public uploader?: Observable<User>;
  @HasOne(SHALLOW_SITE, (m: AudioRecording) => m.siteId)
  public site?: Observable<Site>;

  constructor(audioRecording: IAudioRecording, injector?: Injector) {
    super(audioRecording, injector);
  }

  public get viewUrl(): string {
    console.warn("AudioRecording viewUrl not implement.");
    return "/FIX_ME";
  }
}

type Status =
  | "new"
  | "uploading"
  | "to_check"
  | "ready"
  | "corrupt"
  | "aborted";
