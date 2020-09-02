import { Injector } from "@angular/core";
import { AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, HasAllUsers, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, Deleter, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
import type { User } from "./User";

export interface IAudioEvent extends HasAllUsers {
  id?: Id;
  audioRecordingId?: Id;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  lowFrequencyHertz?: number;
  highFrequencyHertz?: number;
  isReference?: boolean;
}

export class AudioEvent extends AbstractModel implements IAudioEvent {
  public readonly kind = "AudioEvent";
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
  @Creator<AudioEvent>()
  public creator?: User;
  @Updater<AudioEvent>()
  public updater?: User;
  @Deleter<AudioEvent>()
  public deleter?: User;
  @HasOne<AudioEvent>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;

  constructor(audioEvent: IAudioEvent, injector?: Injector) {
    super(audioEvent, injector);
  }

  public get viewUrl(): string {
    throw new Error("AudioEvent viewUrl not implemented.");
  }
}
