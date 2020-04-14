import { siteMenuItem } from "../component/sites/sites.menus";
import {
  DateTimeTimezone,
  dateTimeTimezone,
  Description,
  Id,
  Ids,
  Param,
  TimezoneInformation,
} from "../interfaces/apiInterfaces";
import { AbstractModel } from "./AbstractModel";
import { Project } from "./Project";

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
  public readonly id?: Id;
  public readonly name?: Param;
  public readonly imageUrl?: string;
  public readonly description?: Description;
  public readonly locationObfuscated?: boolean;
  public readonly creatorId?: Id;
  public readonly updaterId?: Id;
  public readonly createdAt?: DateTimeTimezone;
  public readonly updatedAt?: DateTimeTimezone;
  public readonly projectIds?: Ids;
  public readonly customLatitude?: number;
  public readonly customLongitude?: number;
  public readonly timezoneInformation?: TimezoneInformation;

  constructor(site: ISite) {
    super(site);

    this.imageUrl = site.imageUrl || "/assets/images/site/site_span4.png";
    this.locationObfuscated = site.locationObfuscated || false;
    this.projectIds = new Set(site.projectIds || []);
    this.createdAt = dateTimeTimezone(site.createdAt as string);
    this.updatedAt = dateTimeTimezone(site.updatedAt as string);
  }

  public toJSON() {
    // TODO Add image, latitude, longitude, timezone

    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }

  public navigationPath(project: Project): string {
    return siteMenuItem.route.format({
      projectId: project.id,
      siteId: this.id,
    });
  }
}
