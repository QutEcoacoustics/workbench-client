import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Project } from "@models/Project";
import { IRegion, Region } from "@models/Region";
import { Observable } from "rxjs";
import {
  emptyParam,
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

const projectId: IdParam<Project> = id;
const regionId: IdParamOptional<Region> = id;
const endpoint = stringTemplate`/projects/${projectId}/regions/${regionId}${option}`;
const endpointShallow = stringTemplate`/regions/${regionId}${option}`;

/**
 * Regions Service.
 * Handles API routes pertaining to project regions.
 */
@Injectable()
export class RegionsService extends StandardApi<Region, [IdOr<Project>]> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Region, injector);
  }

  public list(project: IdOr<Project>): Observable<Region[]> {
    return this.apiList(endpoint(project, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<IRegion>,
    project: IdOr<Project>
  ): Observable<Region[]> {
    return this.apiFilter(endpoint(project, emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Region>, project: IdOr<Project>): Observable<Region> {
    return this.apiShow(endpoint(project, model, emptyParam));
  }
  public create(model: Region, project: IdOr<Project>): Observable<Region> {
    return this.apiCreate(endpoint(project, emptyParam, emptyParam), model);
  }
  public update(model: Region, project: IdOr<Project>): Observable<Region> {
    return this.apiUpdate(endpoint(project, model, emptyParam), model);
  }
  public destroy(
    model: IdOr<Region>,
    project: IdOr<Project>
  ): Observable<Region | void> {
    return this.apiDestroy(endpoint(project, model, emptyParam));
  }
}

/**
 * Shallow Regions Service.
 * Handles API routes pertaining to regions.
 */
@Injectable()
export class ShallowRegionsService extends StandardApi<Region> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Region, injector);
  }

  public list(): Observable<Region[]> {
    return this.apiList(endpointShallow(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IRegion>): Observable<Region[]> {
    return this.apiFilter(endpointShallow(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Region>): Observable<Region> {
    return this.apiShow(endpointShallow(model, emptyParam));
  }
  public create(model: Region): Observable<Region> {
    return this.apiCreate(endpointShallow(emptyParam, emptyParam), model);
  }
  public update(model: Region): Observable<Region> {
    return this.apiUpdate(endpointShallow(model, emptyParam), model);
  }
  public destroy(model: IdOr<Region>): Observable<Region | void> {
    return this.apiDestroy(endpointShallow(model, emptyParam));
  }
}

export const regionResolvers = new Resolvers<Region, RegionsService>(
  [RegionsService],
  "regionId",
  ["projectId"]
).create("Region");

export const shallowRegionResolvers = new Resolvers<
  Region,
  ShallowRegionsService
>([ShallowRegionsService], "regionId").create("ShallowRegion");
