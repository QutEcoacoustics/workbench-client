import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
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
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon, CommonApiPaths } from "./api-common";
import { Filters } from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends ApiCommon<Site> {
  private paths: CommonApiPaths;

  constructor(http: HttpClient, config: AppConfigService, router: Router) {
    super(http, config, router, Site);

    this.paths = {
      details: this.makeTemplate`/sites`,
      nestedDetails: this.makeTemplate`/projects/${this.id}/sites`,
      show: this.makeTemplate`/sites/${this.id}`,
      nestedShow: this.makeTemplate`/projects/${this.id}/sites/${this.id}`,
      nestedNew: this.makeTemplate`/projects/${this.id}/sites`,
      nestedUpdate: this.makeTemplate`/projects/${this.id}/sites/${this.id}`,
      nestedDelete: this.makeTemplate`/projects/${this.id}/sites/${this.id}`
    };
  }

  /**
   * Get list of sites
   * @param filters API filters
   * @returns Observable list of sites
   */
  public getSites(filters?: Filters): Subject<Site[]> {
    return this.list(this.paths.details(), filters);
  }

  /**
   * Get site data available to the user
   * @param siteId Site ID
   * @param filters API filters
   * @returns Observable returning singular site
   */
  public getSite(siteId: ID, filters?: Filters): Subject<Site> {
    return this.show(this.paths.show(siteId), filters);
  }

  /**
   * Get list of sites for a project
   * @param projectId Project ID
   * @param filters API filters
   * @returns Observable list of sites for a project
   */
  public getProjectSites(projectId: ID, filters?: Filters): Subject<Site[]> {
    return this.list(this.paths.nestedDetails(projectId), filters);
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
    return this.show(this.paths.nestedShow(projectId, siteId), filters);
  }

  /**
   * Create a new site
   * @param projectId Project ID
   * @param details Form details
   */
  public newProjectSite(
    projectId: ID,
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
    return this.new(this.paths.nestedNew(projectId), details);
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
    return this.update(this.paths.nestedUpdate(projectId, siteId), details);
  }

  /**
   * Delete a site
   * @param projectId Project ID
   * @param siteId Site ID
   */
  public deleteProjectSite(projectId: ID, siteId: ID): Subject<boolean> {
    return this.delete(this.paths.nestedDelete(projectId, siteId), projectId);
  }
}
