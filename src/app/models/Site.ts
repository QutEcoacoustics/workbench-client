import { ACCOUNT, PROJECT } from "@baw-api/ServiceTokens";
import { Observable } from "rxjs";
import { siteMenuItem } from "../component/sites/sites.menus";
import {
  DateTimeTimezone,
  Description,
  Id,
  Ids,
  Param,
  TimezoneInformation,
} from "../interfaces/apiInterfaces";
import {
  AbstractModel,
  BawCollection,
  BawDateTime,
  BawPersistAttr,
  HasMany,
  HasOne,
} from "./AbstractModel";
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
  projectIds?: Ids;
  customLatitude?: number;
  customLongitude?: number;
  timezoneInformation?: TimezoneInformation;
}

/**
 * A site model.
 */
export class Site extends AbstractModel implements ISite {
  public readonly kind: "Site" = "Site";
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
  @HasOne(ACCOUNT, (m: Site) => m.creatorId)
  public creator?: Observable<User>;
  @HasOne(ACCOUNT, (m: Site) => m.updaterId)
  public updater?: Observable<User>;
  @HasMany(PROJECT, (m: Site) => m.projectIds)
  public projects?: Observable<Project[]>;

  constructor(site: ISite) {
    super(site);

    this.imageUrl = site.imageUrl || "/assets/images/site/site_span4.png";
    this.locationObfuscated = site.locationObfuscated || false;
  }

  public get viewUrl(): string {
    if (this.projectIds.size === 0) {
      console.error("Site model has no project id, cannot find url.");
      return "";
    }

    return siteMenuItem.route.format({
      projectId: this.projectIds[0],
      siteId: this.id,
    });
  }

  public getViewUrl(project: Project): string {
    return siteMenuItem.route.format({
      projectId: project.id,
      siteId: this.id,
    });
  }
}
