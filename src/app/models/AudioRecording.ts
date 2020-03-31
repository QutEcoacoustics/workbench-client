import { Duration } from "luxon";
import { adminAudioRecordingMenuItem } from "../component/admin/admin.menus";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  duration,
  Id,
  Uuid
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

/**
 * An audio recording model
 */
export interface AudioRecordingInterface {
  id?: Id;
  uuid?: Uuid;
  uploaderId?: Id;
  recordedDate?: DateTimeTimezone | string;
  siteId?: Id;
  durationSeconds?: Duration | number;
  sampleRateHertz?: number;
  channels?: number;
  bitRateBps?: number;
  mediaType?: string;
  dataLengthBytes?: BigInt | number;
  fileHash?: string;
  status?: "ready" | "uploading" | "corrupt";
  notes?: string;
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
export class AudioRecording extends AbstractModel
  implements AudioRecordingInterface {
  public readonly kind: "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly uploaderId?: Id;
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  public readonly durationSeconds?: Duration;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: BigInt;
  public readonly fileHash?: string;
  public readonly status?: "ready" | "uploading" | "corrupt";
  public readonly notes?: string;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly deletedAt?: DateTimeTimezone;
  public readonly originalFileName?: string;
  public readonly recordedUtcOffset?: string;

  constructor(audioRecording: AudioRecordingInterface) {
    super(audioRecording);

    this.kind = "AudioRecording";
    this.recordedDate = dateTimeTimezone(audioRecording.recordedDate as string);
    this.durationSeconds = duration(audioRecording.durationSeconds as number);
    this.dataLengthBytes = audioRecording.dataLengthBytes
      ? BigInt(audioRecording.dataLengthBytes)
      : undefined;
    this.createdAt = dateTimeTimezone(audioRecording.createdAt as string);
    this.updatedAt = dateTimeTimezone(audioRecording.updatedAt as string);
  }

  public static fromJSON = (obj: any) => {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }

    return new AudioRecording(obj);
  };

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
      status: this.status
    };
  }

  redirectPath(): string {
    // TODO Change to Audio Recording Page
    return adminAudioRecordingMenuItem.route.format({
      audioRecordingId: this.id
    });
  }
}
