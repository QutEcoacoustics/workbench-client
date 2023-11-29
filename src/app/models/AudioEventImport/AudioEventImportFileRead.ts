import { TAG } from "@baw-api/ServiceTokens";
import { CollectionIds, DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AbstractModelWithoutId } from "@models/AbstractModel";
import { hasMany } from "@models/AssociationDecorators";
import { bawCollection, bawDateTime } from "@models/AttributeDecorators";
import { Tag } from "@models/Tag";

export interface IAudioEventImportFileRead {
  name: string;
  importedAt: DateTimeTimezone;
  additionalTags: CollectionIds;
}

/**
 * ! This model is subject to change due to planned api changes
 * @see https://github.com/QutEcoacoustics/baw-server/issues/664
 */
export class AudioEventImportFileRead
  extends AbstractModelWithoutId<IAudioEventImportFileRead>
  implements IAudioEventImportFileRead
{
  public readonly kind = "audio_event_import";
  public readonly name: string;
  @bawDateTime()
  public readonly importedAt: DateTimeTimezone;
  @bawCollection()
  public readonly additionalTags: CollectionIds;

  // associations
  @hasMany<AudioEventImportFileRead, Tag>(TAG, "additionalTags")
  public additionalTagModels?: Tag[];

  public get viewUrl(): string {
    return "";
  }
}
