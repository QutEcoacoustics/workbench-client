import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import type { Project } from "@models/Project";
import type { Region } from "@models/Region";
import { ISite, Site } from "@models/Site";
import type { User } from "@models/User";
import { Observable } from "rxjs";
import {
  Empty,
  emptyParam,
  Filter,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

function orphanOption(x?: Filter | Empty) {
  return option(x);
}

const projectId: IdParam<Project> = id;
const siteId: IdParamOptional<Site> = id;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;
const endpointShallow = stringTemplate`/sites/${siteId}${option}`;
const endpointOrphan = stringTemplate`/sites/orphans/${orphanOption}`;

/**
 * Sites Service.
 * Handles API routes pertaining to project sites.
 */
@Injectable()
export class SitesService extends StandardApi<Site, [IdOr<Project>]> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Site, injector);
  }

  public list(project: IdOr<Project>): Observable<Site[]> {
    return this.apiList(endpoint(project, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<ISite>,
    project: IdOr<Project>
  ): Observable<Site[]> {
    return this.apiFilter(endpoint(project, emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Site>, project: IdOr<Project>): Observable<Site> {
    return this.apiShow(endpoint(project, model, emptyParam));
  }
  public create(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiCreate(endpoint(project, emptyParam, emptyParam), model);
  }
  public update(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiUpdate(endpoint(project, model, emptyParam), model);
  }
  public destroy(
    model: IdOr<Site>,
    project: IdOr<Project>
  ): Observable<Site | void> {
    return this.apiDestroy(endpoint(project, model, emptyParam));
  }

  /**
   * Filter project sites by region
   *
   * @param filters Site filters
   * @param project Project to filter by
   * @param region Region to filter by (null if you want sites which are not part of a region)
   */
  public filterByRegion(
    filters: Filters<ISite>,
    project: IdOr<Project>,
    region: IdOr<Region>
  ): Observable<Site[]> {
    return this.filter(
      this.filterByForeignKey(filters, "regionId", region) as Filters,
      project
    );
  }
}

/**
 * Shallow Sites Service.
 * Handles API routes pertaining to sites.
 */
@Injectable()
export class ShallowSitesService extends StandardApi<Site> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Site, injector);
  }

  public list(): Observable<Site[]> {
    return this.apiList(endpointShallow(emptyParam, emptyParam));
  }
  public filter(filters: Filters<ISite>): Observable<Site[]> {
    return this.apiFilter(endpointShallow(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Site>): Observable<Site> {
    return this.apiShow(endpointShallow(model, emptyParam));
  }
  public create(model: Site): Observable<Site> {
    return this.apiCreate(endpointShallow(emptyParam, emptyParam), model);
  }
  public update(model: Site): Observable<Site> {
    return this.apiUpdate(endpointShallow(model, emptyParam), model);
  }
  public destroy(model: IdOr<Site>): Observable<Site | void> {
    return this.apiDestroy(endpointShallow(model, emptyParam));
  }

  /**
   * Filter sites by creator
   *
   * @param filters Site filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<ISite>,
    user: IdOr<User>
  ): Observable<Site[]> {
    return this.filter(
      this.filterByForeignKey(filters, "creatorId", user) as Filters
    );
  }

  /**
   * Filter sites by region
   *
   * @param filters Site filters
   * @param region Region to filter by (null if you want sites which are not part of a region)
   */
  public filterByRegion(
    filters: Filters<ISite>,
    region: IdOr<Region>
  ): Observable<Site[]> {
    return this.filter(
      this.filterByForeignKey(filters, "regionId", region) as Filters
    );
  }

  /**
   * Retrieve orphaned sites (sites which have no parent projects)
   */
  public orphanList(): Observable<Site[]> {
    return this.apiList(endpointOrphan(emptyParam));
  }

  /**
   * Retrieve orphaned sites (sites which have no parent projects)
   *
   * @param filters Filters to apply
   */
  public orphanFilter(filters: Filters<ISite>): Observable<Site[]> {
    return this.apiFilter(endpointOrphan(filterParam), filters);
  }
}

export const siteResolvers = new Resolvers<Site, SitesService>(
  [SitesService],
  "siteId",
  ["projectId"]
).create("Site");

export const shallowSiteResolvers = new Resolvers<Site, ShallowSitesService>(
  [ShallowSitesService],
  "siteId"
).create("ShallowSite");
