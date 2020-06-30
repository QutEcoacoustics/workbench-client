import { Injector } from "@angular/core";
import { IdOr } from "@baw-api/api-common";
import { PROJECT } from "@baw-api/ServiceTokens";
import { siteMenuItem } from "../component/sites/sites.menus";
import {
  DateTimeTimezone,
  Description,
  Id,
  Ids,
  Param,
  TimezoneInformation,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Creator, HasMany, Updater } from "./AssociationDecorators";
import {
  BawCollection,
  BawDateTime,
  BawPersistAttr,
} from "./AttributeDecorators";
import type { Project } from "./Project";
import type { User } from "./User";

/**
 * A site model.
 */
export interface ISite {
  id?: Id;
  name?: Param;
  imageUrl?: string;
  description?: Description;
  locationObfuscated?: boolean;
  creatorId?: Id;
  updaterId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  projectIds?: Ids | Id[];
  customLatitude?: number;
  customLongitude?: number;
  timezoneInformation?: TimezoneInformation;
}

/**
 * A site model.
 */
export class Site extends AbstractModel implements ISite {
  public readonly kind = "Site";
  @BawPersistAttr
  public readonly id?: Id;
  @BawPersistAttr
  public readonly name?: Param;
  @BawPersistAttr
  public readonly imageUrl?: string;
  @BawPersistAttr
  public readonly description?: Description;
  @BawPersistAttr
  public readonly locationObfuscated?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  @BawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @BawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  @BawCollection({ persist: true })
  public readonly projectIds?: Ids;
  @BawPersistAttr
  public readonly customLatitude?: number;
  @BawPersistAttr
  public readonly customLongitude?: number;
  @BawPersistAttr
  public readonly timezoneInformation?: TimezoneInformation;

  // Associations
  @Creator<Site>()
  public creator?: User;
  @Updater<Site>()
  public updater?: User;
  @HasMany<Site>(PROJECT, "projectIds")
  public projects?: Project[];

  constructor(site: ISite, injector?: Injector) {
    super(site, injector);

    this.imageUrl = site.imageUrl || "/images/site/site_span4.png";
    this.locationObfuscated = site.locationObfuscated || false;
  }

  public get viewUrl(): string {
    if (this.projectIds.size === 0) {
      console.error("Site model has no project id, cannot find url.");
      return "";
    }

    return siteMenuItem.route.format({
      projectId: this.projectIds.values().next().value,
      siteId: this.id,
    });
  }

  public getViewUrl(project: IdOr<Project>): string {
    return siteMenuItem.route.format({
      projectId: typeof project === "number" ? project : project.id,
      siteId: this.id,
    });
  }
}
