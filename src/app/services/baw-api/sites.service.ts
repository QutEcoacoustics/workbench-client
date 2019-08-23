import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Site, SiteInterface } from "src/app/models/Site";
import { APIResponseList, Filter, Paths } from "./base-api.service";
import { SecurityService } from "./security.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends SecurityService {
  protected paths: Paths;

  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      list: "/projects/:projectId/sites/",
      flattened: "/sites/:siteId",
      nested: "/projects/:projectId/sites/:siteId",
      filter: "/sites/filter"
    };
  }

  /**
   * Get site data available to the user
   * @param id Site ID
   * @returns Observable returning singular site
   */
  public getSite(id: ID): Subject<Site> {
    const subject = new Subject<Site>();
    const callback = (site: SiteInterface) => new Site(site);

    this.getDetails(subject, callback, this.paths.flattened, {
      args: { siteId: id }
    });

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
    const callback = (site: SiteInterface) => new Site(site);

    this.getDetails(subject, callback, this.paths.nested, {
      args: { projectId, siteId }
    });

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
    const callback = (sites: SiteInterface[]) =>
      sites.map(site => {
        return new Site(site);
      });

    this.getDetails(subject, callback, this.paths.list, {
      args: { projectId: id }
    });

    return subject;
  }

  /**
   * Get list of filtered sites
   * @param filters Filters
   * @returns Observable list of sites
   */
  public getFilteredSites(filters: SiteFilter): Subject<Site[]> {
    const subject = new Subject<Site[]>();
    const callback = (sites: SiteInterface[]) =>
      sites.map(site => {
        return new Site(site);
      });

    this.getDetails(subject, callback, this.paths.filter, { filters });

    return subject;
  }
}

export interface SiteFilter extends Filter {
  orderBy?: "id" | "name" | "description";
}

/**
 * Site interface
 */
export interface SiteResponse extends Response {
  data: SiteInterface;
}

/**
 * Sites interface
 */
export interface SitesResponse extends APIResponseList {
  data: SiteInterface[];
}
