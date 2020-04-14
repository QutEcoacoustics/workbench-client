import {
  DateTimeTimezone,
  dateTimeTimezone,
  Id,
  Uuid,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Duration } from "luxon";

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
  public readonly kind: "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
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
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly deletedAt?: DateTimeTimezone;
  public readonly originalFileName?: string;
  public readonly recordedUtcOffset?: string;

  public get duration() {
    return new Duration();
    // return duration(this.durationSeconds) // TODO Awaiting PR #177
  }

  constructor(audioRecording: IAudioRecording) {
    super(audioRecording);

    this.kind = "AudioRecording";
    this.recordedDate = dateTimeTimezone(audioRecording.recordedDate as string);
    this.createdAt = dateTimeTimezone(audioRecording.createdAt as string);
    this.updatedAt = dateTimeTimezone(audioRecording.updatedAt as string);
    this.deletedAt = dateTimeTimezone(audioRecording.deletedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      uuid: this.uuid,
      siteId: this.siteId,
      durationSeconds: this.durationSeconds,
      sampleRateHertz: this.sampleRateHertz,
      channels: this.channels,
      bitRateBps: this.bitRateBps,
      mediaType: this.mediaType,
      dataLengthBytes: this.dataLengthBytes,
      status: this.status,
      notes: this.notes,
    };
  }

  public navigationPath(): string {
    return "/BROKEN_LINK";
  }
}

type Status = "ready" | "uploading" | "corrupt";
