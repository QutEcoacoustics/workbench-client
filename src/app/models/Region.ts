import { PROJECT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { regionRoute } from "@components/regions/regions.routes";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Hash,
  Id,
  Ids,
  ImageUrl,
  Param,
} from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/config/config.service";
import { AbstractModel } from "./AbstractModel";
import {
  creator,
  deleter,
  hasMany,
  hasOne,
  updater,
} from "./AssociationDecorators";
import {
  bawCollection,
  bawDateTime,
  bawImage,
  bawPersistAttr,
} from "./AttributeDecorators";
import { Project } from "./Project";
import { Site } from "./Site";
import { User } from "./User";

/**
 * A region model.
 */
export interface IRegion extends HasAllUsers, HasDescription {
  id?: Id;
  name?: Param;
  imageUrls?: ImageUrl[];
  image?: File;
  projectId?: Id;
  siteIds?: Id[] | Ids;
  notes?: Hash;
}

/**
 * A region model.
 */
export class Region
  extends AbstractModel<IRegion>
  implements IRegion
{
  public readonly kind = "Region";
  public readonly id?: Id;
  @bawPersistAttr()
  public readonly name?: Param;
  @bawImage<IRegion>(`${assetRoot}/images/site/site_span4.webp`)
  public readonly imageUrls!: ImageUrl[];
  @bawPersistAttr({ supportedFormats: ["formData", "json"] })
  public readonly image?: File;
  @bawPersistAttr()
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  @bawPersistAttr()
  public readonly projectId?: Id;
  @bawCollection({ persist: false })
  public readonly siteIds?: Ids;
  @bawPersistAttr()
  public readonly notes?: Hash;

  // Associations
  @hasOne<Region, Project>(PROJECT, "projectId")
  public project?: Project;
  @hasMany<Region, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @creator<Region>()
  public creator?: User;
  @updater<Region>()
  public updater?: User;
  @deleter<Region>()
  public deleter?: User;

  public get viewUrl(): string {
    return regionRoute.format({
      projectId: this.projectId,
      regionId: this.id,
    });
  }

  public get visualizeUrl(): string {
    return visualizeMenuItem.route.format(undefined, { siteIds: this.siteIds });
  }

  public get license() {
    return this.project?.license;
  }

  public getAudioRecordingsUrl(): string {
    return audioRecordingsRoutes.region.format({
      projectId: this.projectId,
      regionId: this.id,
    });
  }
}
