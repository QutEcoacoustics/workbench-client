import { AUDIO_EVENT_IMPORT, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { hasOne } from "@models/AssociationDecorators";
import { bawPersistAttr, bawSubModelCollection } from "@models/AttributeDecorators";
import { IAudioEvent } from "@models/AudioEvent";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioRecording } from "@models/AudioRecording";
import { ITag, Tag } from "@models/Tag";

export type EventImportError = {
  [K in keyof IImportedAudioEvent]?: string[];
};

export interface IImportedAudioEvent extends IAudioEvent {
  errors?: EventImportError[];
  tags?: ITag[];
}

// TODO: this should probably extend AudioEvent
export class ImportedAudioEvent extends AbstractModel<IImportedAudioEvent> implements IImportedAudioEvent {
  public readonly king = "Imported Audio Event";
  @bawPersistAttr()
  public readonly audioRecordingId?: Id;
  @bawPersistAttr()
  public readonly channel?: number;
  @bawPersistAttr()
  public readonly startTimeSeconds?: number;
  @bawPersistAttr()
  public readonly endTimeSeconds?: number;
  @bawPersistAttr()
  public readonly lowFrequencyHertz?: number;
  @bawPersistAttr()
  public readonly highFrequencyHertz?: number;
  @bawPersistAttr()
  public readonly audioEventImportId?: Id;
  @bawPersistAttr()
  public readonly isReference?: boolean;
  public readonly durationSeconds?: number;
  public readonly creatorId?: Id;
  public readonly score?: number;
  public readonly context?: Record<string, string | null>;
  public readonly errors?: EventImportError[];
  @bawSubModelCollection<ImportedAudioEvent, Tag>(Tag)
  public readonly tags?: Tag[];

  // Associations
  @hasOne<ImportedAudioEvent, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;
  @hasOne<ImportedAudioEvent, AudioEventImport>(AUDIO_EVENT_IMPORT, "audioEventImportId")
  public audioEventImport?: AudioEventImport;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
