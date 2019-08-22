import {
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
  id: ID;
  name: Name;
  imageUrl?: string;
  description: Description;
  locationObfuscated: boolean;
  projectIds: IDs;
  customLatitude?: number;
  customLongitude?: number;
  timezoneInformation?: TimezoneInformation;
}

/**
 * A site model.
 */
export class Site implements SiteInterface {
  public readonly id: ID;
  public readonly name: Name;
  public readonly imageUrl: string;
  public readonly description: Description;
  public readonly locationObfuscated: boolean;
  public readonly projectIds: IDs;
  public readonly customLatitude?: number;
  public readonly customLongitude?: number;
  public readonly timezoneInformation?: TimezoneInformation;

  constructor(site: SiteInterface) {
    this.id = site.id;
    this.name = site.name;
    this.imageUrl = site.imageUrl || "/assets/images/site/site_span4.png";
    this.description = site.description;
    this.locationObfuscated = site.locationObfuscated;
    this.projectIds = new Set(site.projectIds);
    this.customLatitude = site.customLatitude;
    this.customLongitude = site.customLongitude;
    this.timezoneInformation = site.timezoneInformation;
  }

  getSiteUrl(project: Project): string {
    return "not_developed/:projectId/:siteId"
      .replace(":projectId", project.id.toString())
      .replace(":siteId", this.id.toString());
  }
}
