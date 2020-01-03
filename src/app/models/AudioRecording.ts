import { DateTime } from "luxon";
import {
  DateTimeTimezone,
  defaultDateTimeTimezone,
  ID,
  UUID
} from "../interfaces/apiInterfaces";

/**
 * An audio recording model
 */
export interface AudioRecordingInterface {
  kind?: "AudioRecording";
  id: ID;
  uuid: UUID;
  recordedDate: DateTimeTimezone | string;
  siteId: ID;
  durationSeconds: number;
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
export class AudioRecording implements AudioRecordingInterface {
  public readonly kind: "AudioRecording";
  public readonly id: ID;
  public readonly uuid: UUID;
  public readonly recordedDate: DateTimeTimezone;
  public readonly siteId: ID;
  public readonly durationSeconds: number;
  public readonly sampleRateHertz: number;
  public readonly channels: number;
  public readonly bitRateBps: number;
  public readonly mediaType: string;
  public readonly dataLengthBytes: number;
  public readonly status: "ready" | "uploading" | "corrupt";
  public readonly createdAt: DateTimeTimezone;
  public readonly updatedAt: DateTimeTimezone;

  constructor(audioRecording: AudioRecordingInterface) {
    this.kind = "AudioRecording";

    this.id = audioRecording.id;
    this.uuid = audioRecording.uuid;
    this.recordedDate = audioRecording.recordedDate
      ? DateTime.fromISO(audioRecording.recordedDate as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.siteId = audioRecording.siteId;
    this.durationSeconds = audioRecording.durationSeconds;
    this.sampleRateHertz = audioRecording.sampleRateHertz;
    this.channels = audioRecording.channels;
    this.bitRateBps = audioRecording.bitRateBps;
    this.mediaType = audioRecording.mediaType;
    this.dataLengthBytes = audioRecording.dataLengthBytes;
    this.status = audioRecording.status;
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
