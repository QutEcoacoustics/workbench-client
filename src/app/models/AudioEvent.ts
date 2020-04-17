import {
  Id,
  DateTimeTimezone,
  dateTimeTimezone,
} from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";

export interface IAudioEvent {
  id?: Id;
  audioRecordingId?: Id;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  lowFrequencyHertz?: number;
  highFrequencyHertz?: number;
  isReference?: boolean;
  creatorId?: Id;
  updaterId?: Id;
  deleterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deletedAt?: DateTimeTimezone | string;
}

export class AudioEvent extends AbstractModel implements IAudioEvent {
  public readonly kind: "AudioEvent" = "AudioEvent";
  public readonly id?: Id;
  public readonly audioRecordingId?: Id;
  public readonly startTimeSeconds?: number;
  public readonly endTimeSeconds?: number;
  public readonly lowFrequencyHertz?: number;
  public readonly highFrequencyHertz?: number;
  public readonly isReference?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly deletedAt?: DateTimeTimezone;

  constructor(audioEvent: IAudioEvent) {
    super(audioEvent);

    this.createdAt = dateTimeTimezone(audioEvent.createdAt as string);
    this.updatedAt = dateTimeTimezone(audioEvent.updatedAt as string);
    this.deletedAt = dateTimeTimezone(audioEvent.deletedAt as string);
  }

  public toJSON() {
    return {
      id: this.id,
      audioRecordingId: this.audioRecordingId,
      startTimeSeconds: this.startTimeSeconds,
      endTimeSeconds: this.endTimeSeconds,
      lowFrequencyHertz: this.lowFrequencyHertz,
      highFrequencyHertz: this.highFrequencyHertz,
      isReference: this.isReference,
    };
  }

  public get viewUrl(): string {
    return "/BROKEN_LINK";
  }
}
