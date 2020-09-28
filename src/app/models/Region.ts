import { Injector } from "@angular/core";
import { IdOr } from "@baw-api/api-common";
import { PROJECT, SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { siteMenuItem } from "@components/sites/sites.menus";
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

  // TODO Implement region page
  public get viewUrl(): string {
    return "not_implemented";
  }

  public getViewUrl(site: IdOr<Site>): string {
    return siteMenuItem.route.format({
      projectId: this.projectId,
      siteId: typeof site === "number" ? site : site.id,
    });
  }
}
