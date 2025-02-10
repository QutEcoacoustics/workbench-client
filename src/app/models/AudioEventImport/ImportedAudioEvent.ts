import { AUDIO_EVENT_IMPORT, AUDIO_RECORDING } from "@baw-api/ServiceTokens";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { hasOne } from "@models/AssociationDecorators";
import { bawPersistAttr, bawSubModelCollection } from "@models/AttributeDecorators";
import { IAudioEvent } from "@models/AudioEvent";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioRecording } from "@models/AudioRecording";
import { ITag, Tag } from "@models/Tag";

export interface AudioEventError {
  [key: string]: string[];
}

export interface IImportedAudioEvent extends IAudioEvent {
  errors?: AudioEventError[];
  tags?: ITag[];
}

export class ImportedAudioEvent
  extends AbstractModel<IImportedAudioEvent>
  implements IImportedAudioEvent
{
  public readonly king = "Imported Audio Event";
  @bawPersistAttr()
  public audioRecordingId?: Id;
  @bawPersistAttr()
  public channel?: number;
  @bawPersistAttr()
  public startTimeSeconds?: number;
  @bawPersistAttr()
  public endTimeSeconds?: number;
  @bawPersistAttr()
  public lowFrequencyHertz?: number;
  @bawPersistAttr()
  public highFrequencyHertz?: number;
  @bawPersistAttr()
  public audioEventImportId?: Id;
  @bawPersistAttr()
  public isReference?: boolean;
  public creatorId?: Id;
  public context?: Record<string, string | null>;
  public errors?: AudioEventError[];
  @bawSubModelCollection<ImportedAudioEvent, Tag>(Tag)
  public tags?: Tag[];

  // Associations
  @hasOne<ImportedAudioEvent, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording?: AudioRecording;
  @hasOne<ImportedAudioEvent, AudioEventImport>(AUDIO_EVENT_IMPORT, "audioEventImportId")
  public audioEventImport?: AudioEventImport;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
