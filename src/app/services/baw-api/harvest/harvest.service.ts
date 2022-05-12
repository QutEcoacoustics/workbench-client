import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { Resolvers } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import {
  Harvest,
  HarvestStatus,
  IHarvestMapping,
} from "@models/harvest/Harvest";
import { Project } from "@models/Project";
import { map, Observable } from "rxjs";

const projectId: IdParam<Project> = id;
const harvestId: IdParamOptional<Harvest> = id;
const endpoint = stringTemplate`/projects/${projectId}/harvest/${harvestId}${option}`;
const shallowEndpoint = stringTemplate`/harvest/${harvestId}${option}`;

@Injectable()
export class HarvestsService implements StandardApi<Harvest, [IdOr<Project>]> {
  public constructor(private api: BawApiService<Harvest>) {}

  public list(project: IdOr<Project>): Observable<Harvest[]> {
    return this.api.list(Harvest, endpoint(project, emptyParam, emptyParam));
  }

  public filter(
    filters: Filters<Harvest>,
    project: IdOr<Project>
  ): Observable<Harvest[]> {
    return this.api.filter(
      Harvest,
      endpoint(project, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<Harvest>,
    project: IdOr<Project>
  ): Observable<Harvest> {
    return this.api.show(Harvest, endpoint(project, model, emptyParam));
  }

  public create(model: Harvest, project: IdOr<Project>): Observable<Harvest> {
    return this.api.create(
      Harvest,
      endpoint(project, emptyParam, emptyParam),
      (harvest) => endpoint(project, harvest, emptyParam),
      model
    );
  }

  public update(model: Harvest, project: IdOr<Project>): Observable<Harvest> {
    return this.api.update(
      Harvest,
      endpoint(project, model, emptyParam),
      model
    );
  }

  public destroy(
    model: IdOr<Harvest>,
    project: IdOr<Project>
  ): Observable<Harvest | void> {
    return this.api.destroy(endpoint(project, model, emptyParam));
  }

  /**
   * Transition the status of a harvest to the next step
   *
   * @param status Status to change to if valid
   * @param project Project of harvest
   */
  public transitionStatus(
    status: HarvestStatus,
    project: IdOr<Project>
  ): Observable<Harvest> {
    return this.api
      .httpPatch(
        endpoint(project, emptyParam, emptyParam),
        // TODO Replace harvest with Harvest.kind
        { harvest: { status } }
      )
      .pipe(map(this.api.handleSingleResponse(Harvest)));
  }

  /**
   * Update the mappings of a harvest
   *
   * @param mappings Mappings of folders to sites
   * @param project Project of harvest
   */
  public updateMappings(
    mappings: IHarvestMapping[],
    project: IdOr<Project>
  ): Observable<Harvest> {
    return this.api
      .httpPatch(
        endpoint(project, emptyParam, emptyParam),
        // TODO Replace harvest with Harvest.kind
        { harvest: { mappings } }
      )
      .pipe(map(this.api.handleSingleResponse(Harvest)));
  }
}

@Injectable()
export class ShallowHarvestsService implements StandardApi<Harvest> {
  public constructor(private api: BawApiService<Harvest>) {}

  public list(): Observable<Harvest[]> {
    return this.api.list(Harvest, shallowEndpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Harvest>): Observable<Harvest[]> {
    return this.api.filter(
      Harvest,
      shallowEndpoint(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<Harvest>): Observable<Harvest> {
    return this.api.show(Harvest, shallowEndpoint(model, emptyParam));
  }

  public create(model: Harvest): Observable<Harvest> {
    return this.api.create(
      Harvest,
      shallowEndpoint(emptyParam, emptyParam),
      (harvest) => shallowEndpoint(harvest, emptyParam),
      model
    );
  }

  public update(model: Harvest): Observable<Harvest> {
    return this.api.update(Harvest, shallowEndpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Harvest>): Observable<Harvest | void> {
    return this.api.destroy(shallowEndpoint(model, emptyParam));
  }

  /**
   * Transition the status of a harvest to the next step
   *
   * @param status Status to change to if valid
   */
  public transitionStatus(status: HarvestStatus): Observable<Harvest> {
    return this.api
      .httpPatch(
        shallowEndpoint(emptyParam, emptyParam),
        // TODO Replace harvest with Harvest.kind
        { harvest: { status } }
      )
      .pipe(map(this.api.handleSingleResponse(Harvest)));
  }

  /**
   * Update the mappings of a harvest
   *
   * @param mappings Mappings of folders to sites
   */
  public updateMappings(mappings: IHarvestMapping[]): Observable<Harvest> {
    return this.api
      .httpPatch(
        shallowEndpoint(emptyParam, emptyParam),
        // TODO Replace harvest with Harvest.kind
        { harvest: { mappings } }
      )
      .pipe(map(this.api.handleSingleResponse(Harvest)));
  }
}

export const harvestResolvers = new Resolvers<Harvest, [IdOr<Project>]>(
  [HarvestsService],
  "harvestId",
  ["projectId"]
).create("Harvest");

export const shallowHarvestResolvers = new Resolvers<Harvest, []>(
  [ShallowHarvestsService],
  "harvestId"
).create("ShallowHarvest");
