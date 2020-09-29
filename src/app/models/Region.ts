import { Injector } from "@angular/core";
import { PROJECT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { regionMenuItem } from "@components/regions/regions.menus";
import {
  DateTimeTimezone,
  Description,
  HasAllUsers,
  HasDescription,
  Id,
  Ids,
  Notes,
  Param,
} from "@interfaces/apiInterfaces";
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
  siteIds?: Ids;
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
  @HasOne<Region>(PROJECT, "projectId")
  public project?: Project;
  @HasMany<Region>(SHALLOW_SITE, "siteIds")
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
}
