import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import type { User } from "@models/User";
import { generateSite } from "@test/fakes/Site";
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
import { filterMock, showMock } from "../mock/api-commonMock";
import { Resolvers } from "../resolver-common";

const projectId: IdParam<Project> = id;
const siteId: IdParamOptional<Site> = id;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;
const endpointShallow = stringTemplate`/sites/${siteId}${option}`;

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
    // TODO https://github.com/QutEcoacoustics/baw-server/issues/437
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
 * TODO https://github.com/QutEcoacoustics/baw-server/issues/431
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
    return this.filter({});
    // return this.apiList(endpointShallow(Empty, Empty));
  }
  public filter(filters: Filters<ISite>): Observable<Site[]> {
    return filterMock<Site>(
      filters,
      (index) =>
        new Site(
          {
            id: index,
            name: "PLACEHOLDER SITE",
            description: "PLACEHOLDER DESCRIPTION",
            creatorId: 1,
          },
          this.injector
        )
    );
    // return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  public filterByAccessLevel(
    filters: Filters<ISite>,
    user?: IdOr<User>
  ): Observable<Site[]> {
    return this.filter(filters);
    // TODO https://github.com/QutEcoacoustics/baw-server/issues/453
    /* return this.apiFilter(
      endpointShallow(Empty, Filter),
      user ? filterByForeignKey<Site>(filters, "creatorId", user) : filters
    ); */
  }
  public show(model: IdOr<Site>): Observable<Site> {
    return showMock(
      model,
      (index) =>
        new Site(
          { ...generateSite(index), name: "EXAMPLE SITE" },
          this.injector
        )
    );
    // return this.apiShow(endpointShallow(model, Empty));
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
   * @param filters Filters to apply
   */
  public orphans(filters: Filters<Site>): Observable<Site[]> {
    // TODO https://github.com/QutEcoacoustics/baw-server/issues/430
    return filterMock<Site>(
      filters,
      (index) =>
        new Site(
          { ...generateSite(index), name: "EXAMPLE SITE" },
          this.injector
        )
    );
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
