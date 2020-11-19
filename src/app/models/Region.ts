import { Injector } from "@angular/core";
import { PROJECT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { regionMenuItem } from "@components/regions/regions.menus";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Id,
  Ids,
  ImageUrl,
  Notes,
  Param,
} from "@interfaces/apiInterfaces";
import { assetRoot } from "@services/app-config/app-config.service";
import { AbstractModel } from "./AbstractModel";
import {
  Creator,
  HasMany,
  HasOne,
  Owner,
  Updater,
} from "./AssociationDecorators";
import {
  BawCollection,
  BawDateTime,
  BawImage,
  BawPersistAttr,
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
  projectId?: Id;
  siteIds?: Id[] | Ids;
  notes?: Notes;
}

/**
 * A region model.
 */
export class Region extends AbstractModel implements IRegion {
  public readonly kind = "Region";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly imageUrl?: string;
  @BawImage<Region>(`${assetRoot}/images/site/site_span4.png`, {
    key: "imageUrl",
  })
  public readonly image?: ImageUrl[];
  @BawPersistAttr
  public readonly description?: Description;
  public readonly descriptionHtml?: Description;
  public readonly descriptionHtmlTagline?: Description;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly deleterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly deletedAt?: DateTimeTimezone;
  @BawPersistAttr
  public readonly projectId?: Id;
  @BawCollection({ persist: true })
  public readonly siteIds?: Ids;
  @BawPersistAttr
  public readonly notes?: Notes;

  // Associations
  @HasOne<Region, Project>(PROJECT, "projectId")
  public project?: Project;
  @HasMany<Region, Site>(SHALLOW_SITE, "siteIds")
  public sites?: Site[];
  @Creator<Region>()
  public creator?: User;
  @Updater<Region>()
  public updater?: User;
  @Owner<Region>()
  public owner?: User;

  constructor(region: IRegion, injector?: Injector) {
    super(region, injector);
  }

  public get viewUrl(): string {
    return regionMenuItem.route.format({
      projectId: this.projectId,
      regionId: this.id,
    });
  }

  public get visualizeUrl(): string {
    return exploreAudioMenuItem.uri({ regionId: this.id });
  }
}
