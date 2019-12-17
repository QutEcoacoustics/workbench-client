import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
  Description,
  ID,
  IDs,
  Latitude,
  Longitude,
  Name,
  TimezoneInformation
} from "src/app/interfaces/apiInterfaces";
import { Site, SiteInterface } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends BawApiService {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);

    this.paths = {
      list: "/projects/:projectId/sites",
      flattened: "/sites/:siteId",
      nested: "/projects/:projectId/sites/:siteId",
      filter: "/sites/filter",
      new: "/projects/:projectId/sites",
      update: "/projects/:projectId/sites/:siteId"
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

    this.details(subject, callback, this.paths.flattened, {
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

    this.details(subject, callback, this.paths.nested, {
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

    this.details(subject, callback, this.paths.list, {
      args: { projectId: id }
    });

    return subject;
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
      locationObfuscated?: boolean;
      customLatitude?: Latitude;
      customLongitude?: Longitude;
      timezoneInformation?: TimezoneInformation;
    }
  ): Subject<boolean> {
    const subject = new Subject<boolean>();

    const next = () => {
      subject.next(true);
      subject.complete();
    };
    const error = (err: APIErrorDetails) => subject.error(err);

    this.create(
      next,
      error,
      this.paths.new,
      { args: { projectId: id } },
      details,
      {}
    );

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

    const next = () => {
      subject.next(true);
      subject.complete();
    };
    const error = (err: APIErrorDetails) => {
      // Deal with custom info
      if (err.info && err.info.name && err.info.name.length === 1) {
        subject.error(err.message + ": name " + err.info.name[0]);
      } else {
        subject.error(err.message);
      }
    };

    this.update(
      next,
      error,
      this.paths.update,
      { args: { projectId, siteId } },
      details,
      {}
    );

    return subject;
  }
}

export interface SiteFilters extends Filters {
  orderBy?: "id" | "name" | "description";
}
