import { Injector } from "@angular/core";
import { AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { modelData } from "@test/helpers/faker";
import { AbstractModel } from "./AbstractModel";
import { Creator, Deleter, HasOne, Updater } from "./AssociationDecorators";
import { BawDateTime, BawPersistAttr } from "./AttributeDecorators";
import type { AudioRecording } from "./AudioRecording";
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

  public static generate(id?: Id): IAudioEvent {
    const hertzRange = [22050, 8000, 44100, 48000];

    return {
      id: modelData.id(id),
      audioRecordingId: modelData.id(),
      startTimeSeconds: modelData.seconds(),
      endTimeSeconds: modelData.seconds(),
      lowFrequencyHertz: modelData.random.arrayElement(hertzRange),
      highFrequencyHertz: modelData.random.arrayElement(hertzRange),
      isReference: modelData.boolean(),
      creatorId: modelData.id(),
      updaterId: modelData.id(),
      deleterId: modelData.id(),
      createdAt: modelData.timestamp(),
      updatedAt: modelData.timestamp(),
      deletedAt: modelData.timestamp(),
    };
  }

  constructor(audioEvent: IAudioEvent, injector?: Injector) {
    super(audioEvent, injector);
  }

  public get viewUrl(): string {
    throw new Error("AudioEvent viewUrl not implemented.");
  }
}
