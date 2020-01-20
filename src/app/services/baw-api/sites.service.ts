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
import { Site, SiteInterface } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import { Filters } from "./base-api.service";
import { ModelService } from "./model.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends ModelService<Site> {
  private paths: {
    [key: string]: string;
  };

  constructor(http: HttpClient, config: AppConfigService) {
    const classBuilder = (site: SiteInterface) => new Site(site);
    super(http, config, classBuilder);

    this.paths = {
      details: "/sites",
      nestedDetails: "/projects/:projectId/sites",
      show: "/sites/:siteId",
      nestedShow: "/projects/:projectId/sites/:siteId",
      nestedNew: "/projects/:projectId/sites",
      nestedUpdate: "/projects/:projectId/sites/:siteId"
    };
  }

  /**
   * Get list of sites
   * @param filters API filters
   * @returns Observable list of sites
   */
  public getSites(filters?: Filters): Subject<Site[]> {
    return this.list(this.paths.details, filters);
  }

  /**
   * Get site data available to the user
   * @param siteId Site ID
   * @param filters API filters
   * @returns Observable returning singular site
   */
  public getSite(siteId: ID, filters?: Filters): Subject<Site> {
    return this.show(this.paths.show, filters, siteId);
  }

  /**
   * Get list of sites for a project
   * @param projectId Project ID
   * @param filters API filters
   * @returns Observable list of sites for a project
   */
  public getProjectSites(projectId: ID, filters?: Filters): Subject<Site[]> {
    return this.list(this.paths.nestedDetails, filters, projectId);
  }

  /**
   * Get site data available to the user
   * @param projectId Project ID
   * @param siteId Site ID
   * @param filters API filters
   * @returns Observable returning singular site
   */
  public getProjectSite(
    projectId: ID,
    siteId: ID,
    filters?: Filters
  ): Subject<Site> {
    return this.show(this.paths.nestedShow, filters, projectId, siteId);
  }

  /**
   * Create a new site
   * @param id Project ID
   * @param details Form details
   */
  public newProjectSite(
    id: ID,
    details: {
      name: Name;
      description?: Description;
      imageUrl?: string;
      locationObfuscated?: boolean;
      customLatitude?: Latitude;
      customLongitude?: Longitude;
      timezoneInformation?: TimezoneInformation;
    }
  ): Subject<Site> {
    return this.new(this.paths.nestedNew, details, id);
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
      name?: Name;
      description?: Description;
      imageUrl?: string;
      locationObfuscated?: boolean;
      customLatitude?: Latitude;
      customLongitude?: Longitude;
      timezoneInformation?: TimezoneInformation;
    }
  ): Subject<Site> {
    return this.update(this.paths.nestedUpdate, details, projectId, siteId);
  }
}
