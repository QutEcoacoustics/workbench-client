import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import type { Project } from "@models/Project";
import type { Region } from "@models/Region";
import { Site } from "@models/Site";
import type { User } from "@models/User";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  param,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const projectId: IdParam<Project> = id;
const siteId: IdParamOptional<Site> = id;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;
const endpointShallow = stringTemplate`/sites/${siteId}${option}`;
const endpointOrphan = stringTemplate`/sites/orphans/${option}`;
const harvestEndpoint = stringTemplate`/projects/${projectId}/sites/${siteId}/harvest.yml`;
const annotationsEndpoint = stringTemplate`/projects/${projectId}/sites/${siteId}/audio_events/download?${param}`;

/**
 * Sites Service.
 * Handles API routes pertaining to project sites.
 */
@Injectable()
export class SitesService implements StandardApi<Site, [IdOr<Project>]> {
  public constructor(private api: BawApiService<Site>) {}

  public list(project: IdOr<Project>): Observable<Site[]> {
    return this.api.list(Site, endpoint(project, emptyParam, emptyParam));
  }

  public filter(
    filters: Filters<Site>,
    project: IdOr<Project>
  ): Observable<Site[]> {
    return this.api.filter(
      Site,
      endpoint(project, emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<Site>, project: IdOr<Project>): Observable<Site> {
    return this.api.show(Site, endpoint(project, model, emptyParam));
  }

  public create(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.api.create(
      Site,
      endpoint(project, emptyParam, emptyParam),
      (site) => endpoint(project, site, emptyParam),
      model
    );
  }

  public update(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.api.update(Site, endpoint(project, model, emptyParam), model);
  }

  public destroy(
    model: IdOr<Site>,
    project: IdOr<Project>
  ): Observable<Site | void> {
    return this.api.destroy(endpoint(project, model, emptyParam));
  }

  /**
   * Filter project sites by region
   *
   * @param filters Site filters
   * @param project Project to filter by
   * @param region Region to filter by (null if you want sites which are not part of a region)
   */
  public filterByRegion(
    filters: Filters<Site>,
    project: IdOr<Project>,
    region: IdOr<Region>
  ): Observable<Site[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "regionId", region),
      project
    );
  }

  /**
   * Retrieve path to generated a CSV file containing all of the annotations for a site.
   * Insert into the `[href]` of an anchor HTML element.
   */
  public downloadAnnotations(
    model: IdOr<Site>,
    project: IdOr<Project>,
    selectedTimezone: string
  ): string {
    const url = new URL(
      this.api.getPath(annotationsEndpoint(project, model, emptyParam))
    );
    url.searchParams.set("selected_timezone_name", selectedTimezone ?? "UTC");
    return url.toString();
  }

  /**
   * Retrieve path to generate a harvest file. Insert into the `[href]` of a link
   * to create a download link which contains a template for creating a harvest
   * request.
   */
  public harvestFile(model: IdOr<Site>, project: IdOr<Project>): string {
    return this.api.getPath(harvestEndpoint(project, model));
  }
}

/**
 * Shallow Sites Service.
 * Handles API routes pertaining to sites.
 */
@Injectable()
export class ShallowSitesService implements StandardApi<Site> {
  public constructor(private api: BawApiService<Site>) {}

  public list(): Observable<Site[]> {
    return this.api.list(Site, endpointShallow(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Site>): Observable<Site[]> {
    return this.api.filter(
      Site,
      endpointShallow(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<Site>): Observable<Site> {
    return this.api.show(Site, endpointShallow(model, emptyParam));
  }

  public create(model: Site): Observable<Site> {
    return this.api.create(
      Site,
      endpointShallow(emptyParam, emptyParam),
      (site) => endpointShallow(site, emptyParam),
      model
    );
  }

  public update(model: Site): Observable<Site> {
    return this.api.update(Site, endpointShallow(model, emptyParam), model);
  }

  public destroy(model: IdOr<Site>): Observable<Site | void> {
    return this.api.destroy(endpointShallow(model, emptyParam));
  }

  /**
   * Filter sites by creator
   *
   * @param filters Site filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<Site>,
    user: IdOr<User>
  ): Observable<Site[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "creatorId", user)
    );
  }

  /**
   * Filter sites by region
   *
   * @param filters Site filters
   * @param region Region to filter by (null if you want sites which are not part of a region)
   */
  public filterByRegion(
    filters: Filters<Site>,
    region: IdOr<Region>
  ): Observable<Site[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "regionId", region)
    );
  }

  /**
   * Retrieve orphaned sites (sites which have no parent projects)
   */
  public orphanList(): Observable<Site[]> {
    return this.api.list(Site, endpointOrphan(emptyParam));
  }

  /**
   * Retrieve orphaned sites (sites which have no parent projects)
   *
   * @param filters Filters to apply
   */
  public orphanFilter(filters: Filters<Site>): Observable<Site[]> {
    return this.api.filter(Site, endpointOrphan(filterParam), filters);
  }
}

export const siteResolvers = new Resolvers<Site, [IdOr<Project>]>(
  [SitesService],
  "siteId",
  ["projectId"]
).create("Site");

export const shallowSiteResolvers = new Resolvers<Site, []>(
  [ShallowSitesService],
  "siteId"
).create("ShallowSite");
