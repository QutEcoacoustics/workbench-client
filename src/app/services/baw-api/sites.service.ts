import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Site, SiteInterface } from "src/app/models/Site";
import {
  BawApiService,
  ErrorResponse,
  Filter,
  Paths,
  ResponseList
} from "./base-api.service";
import { SecurityService } from "./security.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends BawApiService {
  protected paths: Paths;

  constructor(http: HttpClient, private security: SecurityService) {
    super(http);

    this.paths = {
      list: "/projects/{projectId}/sites/",
      flattened: "/sites/{siteId}",
      nested: "/projects/{projectId}/sites/{siteId}",
      filter: "/sites/filter"
    };
  }

  /**
   * Get site data available to the user
   * @param id Site ID
   * @returns Observable returning singular site
   */
  public getSite(id: number): Subject<Site> {
    const subject = new Subject<Site>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<SiteResponse>(this.paths.flattened, {
        args: { siteId: id }
      }).subscribe(
        (data: SiteResponse) => {
          subject.next(new Site(data.data));
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }

  /**
   * Get site data available to the user
   * @param projectId Project ID
   * @param siteId Site ID
   * @returns Observable returning singular site
   */
  public getProjectSite(projectId: number, siteId: number): Subject<Site> {
    const subject = new Subject<Site>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<SiteResponse>(this.paths.nested, {
        args: { projectId, siteId }
      }).subscribe(
        (data: SiteResponse) => {
          subject.next(new Site(data.data));
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }

  /**
   * Get list of sites for a project
   * @returns Observable list of sites
   * @param id Project ID
   * @returns Observable list of sites for a project
   */
  public getProjectSites(id: number): Subject<Site[]> {
    const subject = new Subject<Site[]>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<SitesResponse>(this.paths.list, {
        args: { projectId: id }
      }).subscribe(
        (data: SitesResponse) => {
          subject.next(
            data.data.map(projectData => {
              return new Site(projectData);
            })
          );
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }

  /**
   * Get list of filtered sites
   * @param filters Filters
   * @returns Observable list of sites
   */
  public getFilteredSites(filters: SiteFiler): Subject<Site[]> {
    const subject = new Subject<Site[]>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<SitesResponse>(this.paths.filter, { filters }).subscribe(
        (data: SitesResponse) => {
          subject.next(
            data.data.map(projectData => {
              return new Site(projectData);
            })
          );
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }
}

export interface SiteFiler extends Filter {
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
export interface SitesResponse extends ResponseList {
  data: SiteInterface[];
}
