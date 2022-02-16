import { Injectable } from "@angular/core";
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
import { BawApiService, Filters } from "../baw-api.service";
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
export class RegionsService implements StandardApi<Region, [IdOr<Project>]> {
  public constructor(private api: BawApiService<Region>) {}

  public list(project: IdOr<Project>): Observable<Region[]> {
    return this.api.list(Region, endpoint(project, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<IRegion>,
    project: IdOr<Project>
  ): Observable<Region[]> {
    return this.api.filter(
      Region,
      endpoint(project, emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<Region>, project: IdOr<Project>): Observable<Region> {
    return this.api.show(Region, endpoint(project, model, emptyParam));
  }
  public create(model: Region, project: IdOr<Project>): Observable<Region> {
    return this.api.create(
      Region,
      endpoint(project, emptyParam, emptyParam),
      (region) => endpoint(project, region, emptyParam),
      model
    );
  }
  public update(model: Region, project: IdOr<Project>): Observable<Region> {
    return this.api.update(Region, endpoint(project, model, emptyParam), model);
  }
  public destroy(
    model: IdOr<Region>,
    project: IdOr<Project>
  ): Observable<Region | void> {
    return this.api.destroy(endpoint(project, model, emptyParam));
  }
}

/**
 * Shallow Regions Service.
 * Handles API routes pertaining to regions.
 */
@Injectable()
export class ShallowRegionsService implements StandardApi<Region> {
  public constructor(private api: BawApiService<Region>) {}

  public list(): Observable<Region[]> {
    return this.api.list(Region, endpointShallow(emptyParam, emptyParam));
  }
  public filter(filters: Filters<Region>): Observable<Region[]> {
    return this.api.filter(
      Region,
      endpointShallow(emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<Region>): Observable<Region> {
    return this.api.show(Region, endpointShallow(model, emptyParam));
  }
  public create(model: Region): Observable<Region> {
    return this.api.create(
      Region,
      endpointShallow(emptyParam, emptyParam),
      (region) => endpointShallow(region, emptyParam),
      model
    );
  }
  public update(model: Region): Observable<Region> {
    return this.api.update(Region, endpointShallow(model, emptyParam), model);
  }
  public destroy(model: IdOr<Region>): Observable<Region | void> {
    return this.api.destroy(endpointShallow(model, emptyParam));
  }
}

export const regionResolvers = new Resolvers<Region, [IdOr<Project>]>(
  [RegionsService],
  "regionId",
  ["projectId"]
).create("Region");

export const shallowRegionResolvers = new Resolvers<Region, []>(
  [ShallowRegionsService],
  "regionId"
).create("ShallowRegion");
