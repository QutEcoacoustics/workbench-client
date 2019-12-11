import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Site } from "src/app/models/Site";
import { SecurityService } from "../security.service";
import { SiteFilters } from "../sites.service";

@Injectable({
  providedIn: "root"
})
export class MockSitesService extends SecurityService {
  constructor(http: HttpClient) {
    super(http);
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
}
