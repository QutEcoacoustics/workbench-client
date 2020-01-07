import { DateTime } from "luxon";
import { siteMenuItem } from "../component/sites/sites.menus";
import {
  DateTimeTimezone,
  defaultDateTimeTimezone,
  Description,
  ID,
  IDs,
  Name,
  TimezoneInformation
} from "../interfaces/apiInterfaces";
import { Project } from "./Project";

/**
 * A site model.
 */
export interface SiteInterface {
  kind?: "Site";
  id: ID;
  name: Name;
  imageUrl?: string;
  description: Description;
  locationObfuscated?: boolean;
  creatorId: ID;
  createdAt?: DateTimeTimezone | string;
  updaterId?: ID;
  updatedAt?: DateTimeTimezone | string;
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
  public readonly createdAt?: DateTimeTimezone;
  public readonly updaterId?: ID;
  public readonly updatedAt?: DateTimeTimezone;
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
    this.locationObfuscated = site.locationObfuscated || false;
    this.projectIds = new Set(site.projectIds);
    this.creatorId = site.creatorId;
    this.createdAt = site.createdAt
      ? DateTime.fromISO(site.createdAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.updaterId = site.updaterId;
    this.updatedAt = site.updatedAt
      ? DateTime.fromISO(site.updatedAt as string, {
          setZone: true
        })
      : defaultDateTimeTimezone;
    this.customLatitude = site.customLatitude;
    this.customLongitude = site.customLongitude;
    this.timezoneInformation = site.timezoneInformation;
  }

  getSiteUrl(project: Project): string {
    return siteMenuItem.route.format({
      projectId: project.id,
      siteId: this.id
    });
  }
}

export const mockSite = new Site({
  id: 1,
  name: "name",
  description: "description",
  creatorId: 1,
  projectIds: new Set([0]),
  imageUrl: "/assets/images/site/site_span4.png"
});
