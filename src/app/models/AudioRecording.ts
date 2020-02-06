import { DateTime } from "luxon";
import {
  DateTimeTimezone,
  defaultDateTimeTimezone,
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
  recordedDate?: DateTimeTimezone | string;
  siteId?: Id;
  durationSeconds?: number;
  sampleRateHertz?: number;
  channels?: number;
  bitRateBps?: number;
  mediaType?: string;
  dataLengthBytes?: number;
  status?: "ready" | "uploading" | "corrupt";
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
}

/**
 * An audio recording model
 */
export class AudioRecording extends AbstractModel
  implements AudioRecordingInterface {
  public readonly kind: "AudioRecording";
  public readonly id?: Id;
  public readonly uuid?: Uuid;
  public readonly recordedDate?: DateTimeTimezone;
  public readonly siteId?: Id;
  public readonly durationSeconds?: number;
  public readonly sampleRateHertz?: number;
  public readonly channels?: number;
  public readonly bitRateBps?: number;
  public readonly mediaType?: string;
  public readonly dataLengthBytes?: number;
  public readonly status?: "ready" | "uploading" | "corrupt";
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;

  constructor(audioRecording: AudioRecordingInterface) {
    super(audioRecording);

    this.kind = "AudioRecording";
    this.recordedDate = audioRecording.recordedDate
      ? DateTime.fromISO(audioRecording.recordedDate as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.createdAt = audioRecording.createdAt
      ? DateTime.fromISO(audioRecording.createdAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.updatedAt = audioRecording.updatedAt
      ? DateTime.fromISO(audioRecording.updatedAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
  }
}
