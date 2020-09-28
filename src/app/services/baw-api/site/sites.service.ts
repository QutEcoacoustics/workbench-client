import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import type { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import type { User } from "@models/User";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  filterByForeignKey,
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
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Site, injector);
  }

  public list(project: IdOr<Project>): Observable<Site[]> {
    return this.apiList(endpoint(project, Empty, Empty));
  }
  public filter(
    filters: Filters<ISite>,
    project: IdOr<Project>
  ): Observable<Site[]> {
    return this.apiFilter(endpoint(project, Empty, Filter), filters);
  }
  public show(model: IdOr<Site>, project: IdOr<Project>): Observable<Site> {
    return this.apiShow(endpoint(project, model, Empty));
  }
  public create(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiCreate(endpoint(project, Empty, Empty), model);
  }
  public update(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiUpdate(endpoint(project, model, Empty), model);
  }
  public destroy(
    model: IdOr<Site>,
    project: IdOr<Project>
  ): Observable<Site | void> {
    return this.apiDestroy(endpoint(project, model, Empty));
  }
}

/**
 * Shallow Sites Service.
 * Handles API routes pertaining to sites.
 */
@Injectable()
export class ShallowSitesService extends StandardApi<Site> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Site, injector);
  }

  public list(): Observable<Site[]> {
    return this.apiList(endpointShallow(Empty, Empty));
  }
  public filter(filters: Filters<ISite>): Observable<Site[]> {
    return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  public filterByCreator(
    filters: Filters<ISite>,
    user?: IdOr<User>
  ): Observable<Site[]> {
    return this.apiFilter(
      endpointShallow(Empty, Filter),
      user ? filterByForeignKey<Site>(filters, "creatorId", user) : filters
    );
  }
  public show(model: IdOr<Site>): Observable<Site> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  public create(model: Site): Observable<Site> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  public update(model: Site): Observable<Site> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  public destroy(model: IdOr<Site>): Observable<Site | void> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }

  /**
   * Retrieve orphaned sites (sites which have no parent projects)
   */
  public orphanList(): Observable<Site[]> {
    return this.apiList(endpointOrphan(Empty));
  }

  /**
   * Retrieve orphaned sites (sites which have no parent projects)
   * @param filters Filters to apply
   */
  public orphanFilter(filters: Filters<ISite>): Observable<Site[]> {
    return this.apiFilter(endpointOrphan(Filter), filters);
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
