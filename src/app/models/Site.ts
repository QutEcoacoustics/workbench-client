/**
 * A site model.
 */
export interface SiteInterface {
  description: string;
  id: number;
  imageUrl?: string;
  locationObfuscated: boolean;
  name: string;
  projectIds: number[];
  customLatitude?: number;
  customLongitude?: number;
  timezoneInformation?: {
    friendlyIdentifier: string;
    identifier: string;
    identifierAlt: string;
    utcOffset: number;
    utcTotalOffset: number;
  };
}

/**
 * A site model.
 */
export class Site implements SiteInterface {
  public readonly id: number;
  public readonly name: string;
  public readonly imageUrl: string;
  public readonly description: string;
  public readonly locationObfuscated: boolean;
  public readonly projectIds: number[];
  public readonly customLatitude?: number;
  public readonly customLongitude?: number;
  public readonly timezoneInformation?: {
    friendlyIdentifier: string;
    identifier: string;
    identifierAlt: string;
    utcOffset: number;
    utcTotalOffset: number;
  };

  constructor(site: SiteInterface) {
    this.id = site.id;
    this.name = site.name;
    this.imageUrl = site.imageUrl || "/assets/images/site/site_span4.png";
    this.description = site.description;
    this.locationObfuscated = site.locationObfuscated;
    this.projectIds = site.projectIds;
    this.customLatitude = site.customLatitude;
    this.customLongitude = site.customLongitude;
    this.timezoneInformation = site.timezoneInformation;
  }
}
