import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
  Description,
  ID,
  Latitude,
  Longitude,
  Name,
  TimezoneInformation
} from "src/app/interfaces/apiInterfaces";
import { Site } from "src/app/models/Site";
import { AppConfigService } from "../../app-config/app-config.service";
import { BawApiService } from "../base-api.service";
import { SiteFilters } from "../sites.service";

@Injectable({
  providedIn: "root"
})
export class MockSitesService extends BawApiService {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);
  }

  /**
   * Get site data available to the user
   * @param id Site ID
   * @returns Observable returning singular site
   */
  public getSite(id: ID): Subject<Site> {
    const subject = new Subject<Site>();

    return subject;
  }

  /**
   * Get site data available to the user
   * @param projectId Project ID
   * @param siteId Site ID
   * @returns Observable returning singular site
   */
  public getProjectSite(projectId: ID, siteId: ID): Subject<Site> {
    const subject = new Subject<Site>();

    return subject;
  }

  /**
   * Get list of sites for a project
   * @returns Observable list of sites
   * @param id Project ID
   * @returns Observable list of sites for a project
   */
  public getProjectSites(id: ID): Subject<Site[]> {
    const subject = new Subject<Site[]>();

    return subject;
  }

  /**
   * Get list of filtered sites
   * @param filters Filters
   * @returns Observable list of sites
   */
  public getFilteredSites(filters: SiteFilters): Subject<Site[]> {
    const subject = new Subject<Site[]>();

    return subject;
  }

  /**
   * Update a projects site
   * @param projectId Project ID
   * @param siteId Site ID
   * @param details Form details
   */
  public updateProjectSite(
    projectId: ID,
    siteId: ID,
    details: {
      name: Name;
      description?: Description;
      locationObfuscated?: boolean;
      customLatitude?: Latitude;
      customLongitude?: Longitude;
      timezoneInformation?: TimezoneInformation;
    }
  ): Subject<boolean> {
    const subject = new Subject<boolean>();

    return subject;
  }
}
