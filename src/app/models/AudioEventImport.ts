import { DateTimeTimezone, Description, Id } from "@interfaces/apiInterfaces";
import { ANALYSIS_JOB, USER } from "@baw-api/ServiceTokens";
import { annotationImportRoute } from "@components/import-annotations/import-annotations.routes";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime, bawPersistAttr, bawSubModelCollection } from "./AttributeDecorators";
import { hasOne } from "./AssociationDecorators";
import { User } from "./User";
import { IImportedAudioEvent, ImportedAudioEvent } from "./AudioEventImport/ImportedAudioEvent";
import { AnalysisJob } from "./AnalysisJob";

export interface IAudioEventImport {
  id?: Id;
  name?: string;
  description?: Description;
  descriptionHtml?: Description;
  descriptionHtmlTagline?: Description;
  createdAt?: DateTimeTimezone;
  updatedAt?: DateTimeTimezone;
  deletedAt?: DateTimeTimezone;
  creatorId?: Id;
  deleterId?: Id;
  updaterId?: Id;
  importedEvents?: IImportedAudioEvent[];
  analysisJobId?: Id;
}

export class AudioEventImport
  extends AbstractModel<IAudioEventImport>
  implements IAudioEventImport
{
  public readonly kind = "audio_event_import";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: string;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  public readonly creatorId?: Id;
  public readonly deleterId?: Id;
  public readonly updaterId?: Id;
  public readonly analysisJobId?: Id;
  @bawSubModelCollection<AudioEventImport, ImportedAudioEvent>(ImportedAudioEvent)
  public readonly importedEvents?: ImportedAudioEvent[];

  // Associations
  @hasOne<AudioEventImport, User>(USER, "creatorId")
  public creator?: User;
  @hasOne<AudioEventImport, User>(USER, "deleterId")
  public deleter?: User;
  @hasOne<AudioEventImport, User>(USER, "updaterId")
  public updater?: User;
  @hasOne<AudioEventImport, AnalysisJob>(ANALYSIS_JOB, "analysisJobId")
  public analysisJob?: AnalysisJob;

  public get viewUrl(): string {
    return annotationImportRoute.format({
      annotationId: this.id,
    });
  }
}
