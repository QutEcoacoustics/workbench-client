import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { Observable } from "rxjs";
import {
  AbstractModel,
  BawDateTime,
  BawPersistAttr,
  Creator,
  Deleter,
  Updater,
} from "./AbstractModel";
import type { User } from "./User";

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
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly audioRecordingId?: Id;
  @BawPersistAttr
  public readonly startTimeSeconds?: number;
  @BawPersistAttr
  public readonly endTimeSeconds?: number;
  @BawPersistAttr
  public readonly lowFrequencyHertz?: number;
  @BawPersistAttr
  public readonly highFrequencyHertz?: number;
  @BawPersistAttr
  public readonly isReference?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;

  // Associations
  // TODO Add AudioRecording association
  @Creator<AudioEvent>()
  public creator?: Observable<User>;
  @Updater<AudioEvent>()
  public updater?: Observable<User>;
  @Deleter<AudioEvent>()
  public deleter?: Observable<User>;

  constructor(audioEvent: IAudioEvent) {
    super(audioEvent);
  }

  public get viewUrl(): string {
    throw new Error("AudioEvent viewUrl not implemented.");
  }
}
