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
  HarvestMapping,
  HarvestStatus,
  IHarvestMapping,
} from "@models/Harvest";
import { Project } from "@models/Project";
import snakeCase from "just-snake-case";
import { map, Observable } from "rxjs";

const projectId: IdParam<Project> = id;
const harvestId: IdParamOptional<Harvest> = id;
const endpoint = stringTemplate`/projects/${projectId}/harvests/${harvestId}${option}`;
const shallowEndpoint = stringTemplate`/harvests/${harvestId}${option}`;

@Injectable()
export class HarvestsService implements StandardApi<Harvest, [IdOr<Project>]> {
  public constructor(
    private api: BawApiService<Harvest>,
    private shallowHarvestsApi: ShallowHarvestsService
  ) {}

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

  public showWithoutCache(
    model: IdOr<Harvest>,
    project: IdOr<Project>
  ): Observable<Harvest> {
    return this.api.show(Harvest, endpoint(project, model, emptyParam), {
      cacheOptions: { isCacheable: () => false },
    });
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

  /** @inheritdoc ShallowHarvestsService.transitionStatus */
  public transitionStatus(
    model: IdOr<Harvest>,
    status: HarvestStatus
  ): Observable<Harvest> {
    return this.shallowHarvestsApi.transitionStatus(model, status);
  }

  /** @inheritdoc ShallowHarvestsService.updateMappings */
  public updateMappings(
    model: IdOr<Harvest>,
    mappings: (IHarvestMapping | HarvestMapping)[]
  ): Observable<Harvest> {
    return this.shallowHarvestsApi.updateMappings(model, mappings);
  }
}

@Injectable()
export class ShallowHarvestsService implements StandardApi<Harvest> {
  private harvestKind = new Harvest({}).kind;

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
  public transitionStatus(
    model: IdOr<Harvest>,
    status: HarvestStatus
  ): Observable<Harvest> {
    return this.api
      .httpPatch(shallowEndpoint(model, emptyParam), {
        // TODO This is a sub-optimal solution, if we encounter this in other
        // places, a more permanent solution should be found
        [this.harvestKind]: { status: snakeCase(status) },
      })
      .pipe(map(this.api.handleSingleResponse(Harvest)));
  }

  /**
   * Updates the name of a harvest
   *
   * @param name New name of the harvest
   */
  public updateName(
    model: Harvest,
    newHarvestName: string
  ): Observable<Harvest> {
    return this.api
      .httpPatch(shallowEndpoint(model, emptyParam), {
        [this.harvestKind]: { name: newHarvestName }
      })
      .pipe(map(this.api.handleSingleResponse(Harvest)));
  }

  /**
   * Update the mappings of a harvest
   *
   * @param mappings Mappings of folders to sites
   */
  public updateMappings(
    model: IdOr<Harvest>,
    mappings: (HarvestMapping | IHarvestMapping)[]
  ): Observable<Harvest> {
    const mappingData: IHarvestMapping[] = mappings.map((mapping) =>
      mapping instanceof HarvestMapping
        ? mapping.getJsonAttributes({ update: true })
        : mapping
    );

    return this.api
      .httpPatch(shallowEndpoint(model, emptyParam), {
        [this.harvestKind]: { mappings: mappingData },
      })
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
