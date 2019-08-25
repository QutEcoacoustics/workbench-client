import { siteMenuItem } from "../component/sites/sites.menus";
import {
  Description,
  ID,
  IDs,
  Name,
  Time,
  TimezoneInformation
} from "../interfaces/apiInterfaces";
import { Project } from "./Project";

/**
 * A site model.
 */
export interface SiteInterface {
  id: ID;
  name: Name;
  imageUrl?: string;
  description: Description;
  locationObfuscated: boolean;
  creatorId: ID;
  createdAt?: Time;
  updaterId?: ID;
  updatedAt?: Time;
  projectIds: IDs;
  customLatitude?: number;
  customLongitude?: number;
  timezoneInformation?: TimezoneInformation;
}

/**
 * A site model.
 */
export class Site implements SiteInterface {
  public readonly kind: "Site";
  public readonly id: ID;
  public readonly name: Name;
  public readonly imageUrl: string;
  public readonly description: Description;
  public readonly locationObfuscated: boolean;
  public readonly creatorId: ID;
  public readonly createdAt?: Time;
  public readonly updaterId?: ID;
  public readonly updatedAt?: Time;
  public readonly projectIds: IDs;
  public readonly customLatitude?: number;
  public readonly customLongitude?: number;
  public readonly timezoneInformation?: TimezoneInformation;

  constructor(site: SiteInterface) {
    this.kind = "Site";
    this.id = site.id;
    this.name = site.name;
    this.imageUrl = site.imageUrl || "/assets/images/site/site_span4.png";
    this.description = site.description;
    this.locationObfuscated = site.locationObfuscated;
    this.projectIds = new Set(site.projectIds);
    this.creatorId = site.creatorId;
    this.createdAt = site.createdAt || "1970-01-01T00:00:00.000+10:00";
    this.updaterId = site.updaterId;
    this.updatedAt = site.updatedAt || "1970-01-01T00:00:00.000+10:00";
    this.customLatitude = site.customLatitude;
    this.customLongitude = site.customLongitude;
    this.timezoneInformation = site.timezoneInformation;
  }

  getSiteUrl(project: Project): string {
    return siteMenuItem.route
      .toString()
      .replace(":projectId", project.id.toString())
      .replace(":siteId", this.id.toString());
  }
}
