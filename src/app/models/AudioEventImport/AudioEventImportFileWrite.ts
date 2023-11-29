import { TAG } from "@baw-api/ServiceTokens";
import { CollectionIds, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { hasMany } from "@models/AssociationDecorators";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { Tag } from "@models/Tag";

export interface IAudioEventImportFileWrite {
  id: Id;
  file: File;
  additionalTagIds: CollectionIds;
  commit: boolean;
}

/**
 * A write only model used to add files to an audio event import
 *
 * ! This model is subject to change due to planned api changes
 * @see https://github.com/QutEcoacoustics/baw-server/issues/664
 */
export class AudioEventImportFileWrite
  extends AbstractModel<IAudioEventImportFileWrite>
  implements IAudioEventImportFileWrite
{
  public readonly kind = "import";
  public readonly id: Id;
  @bawPersistAttr({ supportedFormats: ["formData"] })
  public readonly file: File;
  @bawPersistAttr({ supportedFormats: ["formData"] })
  public readonly additionalTagIds: CollectionIds;
  @bawPersistAttr({ supportedFormats: ["formData"] })
  public readonly commit: boolean;

  // associations
  @hasMany<AudioEventImportFileWrite, Tag>(TAG, "additionalTagIds")
  public additionalTagModels?: Tag[];

  public get viewUrl(): string {
    return "";
  }
}
