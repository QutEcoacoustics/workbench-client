import { DateTimeTimezone, FilePath, Id, Ids } from "@interfaces/apiInterfaces";
import { ANALYSIS_JOB_ITEM, AUDIO_EVENT_IMPORT, TAG } from "@baw-api/ServiceTokens";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { AbstractModel } from "./AbstractModel";
import { ImportedAudioEvent } from "./AudioEventImport/ImportedAudioEvent";
import { hasMany, hasOne } from "./AssociationDecorators";
import { AnalysisJobItem } from "./AnalysisJobItem";
import { Tag } from "./Tag";
import { AudioEventImport } from "./AudioEventImport";

export interface IAudioEventImportFile {
  id?: Id;
  fileHash?: string;
  path?: FilePath;
  createdAt?: DateTimeTimezone;
  additionalTagIds?: Ids;
  analysisJobsItemId?: Id;
  audioEventImportId?: Id;
}

export class AudioEventImportFile
  extends AbstractModel<ImportedAudioEvent>
  implements IAudioEventImportFile
{
  public readonly kind = "audio_event_import_file";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly fileHash?: string;
  @bawPersistAttr()
  public readonly path?: FilePath;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  public readonly additionalTagIds?: Ids;
  public readonly analysisJobsItemId?: Id;
  public readonly audioEventImportId?: Id;

  // Associations
  @hasMany<AudioEventImportFile, Tag>(TAG, "additionalTagIds")
  public readonly additionalTags?: Tag[];
  @hasOne<AudioEventImportFile, AnalysisJobItem>(ANALYSIS_JOB_ITEM, "analysisJobsItemId")
  public readonly analysisJobItem?: AnalysisJobItem;
  @hasOne<AudioEventImportFile, AudioEventImport>(AUDIO_EVENT_IMPORT, "audioEventImportId")
  public readonly audioEventImport?: AudioEventImport;

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}
