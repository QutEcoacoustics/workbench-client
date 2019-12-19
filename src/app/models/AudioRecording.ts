import { DateTime, ID, UUID } from "../interfaces/apiInterfaces";

/**
 * An audio recording model
 */
export interface AudioRecordingInterface {
  kind?: "AudioRecording";
  id: ID;
  uuid: UUID;
  recordedDate: DateTime | string;
  siteId: ID;
  durationSeconds: number;
  sampleRateHertz?: number;
  channels?: number;
  bitRateBps?: number;
  mediaType?: string;
  dataLengthBytes?: number;
  status?: "ready" | "uploading" | "corrupt";
  createdAt?: DateTime;
  updatedAt?: DateTime;
}

/**
 * An audio recording model
 */
export class AudioRecording implements AudioRecordingInterface {
  public readonly kind: "AudioRecording";
  public readonly id: ID;
  public readonly uuid: UUID;
  public readonly recordedDate: DateTime;
  public readonly siteId: ID;
  public readonly durationSeconds: number;
  public readonly sampleRateHertz: number;
  public readonly channels: number;
  public readonly bitRateBps: number;
  public readonly mediaType: string;
  public readonly dataLengthBytes: number;
  public readonly status: "ready" | "uploading" | "corrupt";
  public readonly createdAt: DateTime;
  public readonly updatedAt: DateTime;

  constructor(audioRecording: AudioRecordingInterface) {
    this.kind = "AudioRecording";

    this.id = audioRecording.id;
    this.uuid = audioRecording.uuid;
    this.recordedDate = audioRecording.recordedDate
      ? new Date(audioRecording.recordedDate)
      : new Date("1970-01-01T00:00:00.000+10:00");
    this.siteId = audioRecording.siteId;
    this.durationSeconds = audioRecording.durationSeconds;
    this.sampleRateHertz = audioRecording.sampleRateHertz;
    this.channels = audioRecording.channels;
    this.bitRateBps = audioRecording.bitRateBps;
    this.mediaType = audioRecording.mediaType;
    this.dataLengthBytes = audioRecording.dataLengthBytes;
    this.status = audioRecording.status;
    this.createdAt = audioRecording.createdAt
      ? new Date(audioRecording.createdAt)
      : new Date("1970-01-01T00:00:00.000+10:00");
    this.updatedAt = audioRecording.updatedAt
      ? new Date(audioRecording.updatedAt)
      : new Date("1970-01-01T00:00:00.000+10:00");
  }
}
