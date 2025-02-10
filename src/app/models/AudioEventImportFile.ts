import { CollectionIds, DateTimeTimezone, FilePath, Id } from "@interfaces/apiInterfaces";
import {
  ANALYSIS_JOB_ITEM,
  AUDIO_EVENT_IMPORT,
  TAG,
} from "@baw-api/ServiceTokens";
import { bawDateTime, bawPersistAttr } from "./AttributeDecorators";
import { AbstractModel } from "./AbstractModel";
import { hasMany, hasOne } from "./AssociationDecorators";
import { AnalysisJobItem } from "./AnalysisJobItem";
import { Tag } from "./Tag";
import { AudioEventImport } from "./AudioEventImport";

export interface IAudioEventImportFile {
  id?: Id;
  fileHash?: string;
  path?: FilePath;
  createdAt?: DateTimeTimezone;

  analysisJobsItemId?: Id;
  audioEventImportId?: Id;
  file?: File;
  additionalTagIds?: CollectionIds;
  commit?: boolean;
}

export class AudioEventImportFile
  extends AbstractModel<IAudioEventImportFile>
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

  // form data fields
  @bawPersistAttr({ supportedFormats: ["formData"], create: true })
  public readonly analysisJobsItemId?: Id;
  @bawPersistAttr({ supportedFormats: ["formData"], create: true })
  public readonly audioEventImportId?: Id;
  @bawPersistAttr({ supportedFormats: ["formData"], create: true })
  public readonly file: File;
  @bawPersistAttr({ supportedFormats: ["formData"], create: true })
  public readonly additionalTagIds: CollectionIds;
  @bawPersistAttr({ supportedFormats: ["formData"], create: true })
  public readonly commit: boolean;

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
