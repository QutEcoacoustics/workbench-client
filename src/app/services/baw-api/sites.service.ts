import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BawApiService,
  Filter,
  List,
  MetaError,
  Paths
} from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends BawApiService {
  protected paths: Paths;

  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      sites: {
        list: "/projects/{projectId}/sites/",
        flattened: "/sites/{siteId}",
        nested: "/projects/{projectId}/sites/{siteId}",
        filter: "/sites/filter"
      }
    };
  }

  /**
   * Get site data
   * @param id Site ID
   */
  public getSite(id: number) {
    return this.get<Site>(this.paths.sites.flattened, {
      args: { siteId: id }
    });
  }

  /**
   * Get list of sites accessible by user
   * @returns Observable list of all sites
   */
  public getSites() {
    return this.getFilteredSites(undefined);
  }

  /**
   * Get site data
   * @param projectId Project ID
   * @param siteId Site ID
   * @returns Observable returning singular site
   */
  public getProjectSite(projectId: number, siteId: number) {
    return this.get<Site>(this.paths.sites.nested, {
      args: { projectId, siteId }
    });
  }

  /**
   * Get list of sites for a project
   * @returns Observable list of sites
   * @param id Project ID
   * @returns Observable list of sites for a project
   */
  public getProjectSites(id: number) {
    return this.get<Sites>(this.paths.sites.list, {
      args: { projectId: id }
    });
  }

  /**
   * Get list of filtered sites
   * @param filters Filters
   * @returns Observable list of sites
   */
  public getFilteredSites(filters: SiteFiler) {
    return this.get<Sites>(this.paths.sites.filter, { filters });
  }
}

export interface SiteFiler extends Filter {
  orderBy?: "id" | "name" | "description";
}

/**
 * Site data interface
 */
export interface SiteData {
  customLatitude?: number;
  customLongitude?: number;
  description: string;
  id: number;
  locationObfuscated: boolean;
  name: string;
  projectIds: number[];
  timezoneInformation?: {
    friendlyIdentifier: string;
    identifier: string;
    identifierAlt: string;
    utcOffset: number;
    utcTotalOffset: number;
  };
}

/**
 * Site interface
 */
export interface Site {
  meta: {
    status: number;
    message: string;
    error?: MetaError;
  };
  data: SiteData;
}

/**
 * Sites interface
 */
export interface Sites extends List {
  data: SiteData[];
}
