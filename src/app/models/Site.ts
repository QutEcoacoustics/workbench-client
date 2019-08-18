/**
 * A site model.
 */
export interface SiteInterface {
  description: string;
  id: number;
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
  /**
   * Constructor
   * @param id Site ID
   * @param name Site name
   * @param description Site description
   * @param locationObfuscated Is site location obfuscated
   * @param projectIds Project ID's associated with site
   * @param customLatitude Site custom latitude
   * @param customLongitude Site custom longitude
   * @param timezoneInformation Site timezone information
   */
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly locationObfuscated: boolean,
    public readonly projectIds: number[],
    public readonly customLatitude?: number,
    public readonly customLongitude?: number,
    public readonly timezoneInformation?: {
      friendlyIdentifier: string;
      identifier: string;
      identifierAlt: string;
      utcOffset: number;
      utcTotalOffset: number;
    }
  ) {}
}
