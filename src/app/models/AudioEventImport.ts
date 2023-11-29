import { DateTimeTimezone, Description, Id } from "@interfaces/apiInterfaces";
import { USER } from "@baw-api/ServiceTokens";
import { annotationImportRoute } from "@components/import-annotations/import-annotations.routes";
import { AbstractModel } from "./AbstractModel";
import { bawDateTime, bawPersistAttr, bawSubModelCollection } from "./AttributeDecorators";
import { hasOne } from "./AssociationDecorators";
import { User } from "./User";
import { AudioEventImportFileRead, IAudioEventImportFileRead } from "./AudioEventImport/AudioEventImportFileRead";
import { IImportedAudioEvent, ImportedAudioEvent } from "./AudioEventImport/ImportedAudioEvent";

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
  files?: IAudioEventImportFileRead[];
  importedEvents?: IImportedAudioEvent[];
}

/**
 * ! Due to planned api changes, this model is subject to change
 * @see https://github.com/QutEcoacoustics/baw-server/issues/664
 */
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
  @bawSubModelCollection<AudioEventImport, AudioEventImportFileRead>(AudioEventImportFileRead)
  public readonly files?: AudioEventImportFileRead[];
  @bawSubModelCollection<AudioEventImport, ImportedAudioEvent>(ImportedAudioEvent)
  public readonly importedEvents?: ImportedAudioEvent[];

  // Associations
  @hasOne<AudioEventImport, User>(USER, "creatorId")
  public creator?: User;
  @hasOne<AudioEventImport, User>(USER, "deleterId")
  public deleter?: User;
  @hasOne<AudioEventImport, User>(USER, "updaterId")
  public updater?: User;

  public get viewUrl(): string {
    return annotationImportRoute.format({
      annotationId: this.id,
    });
  }
}
