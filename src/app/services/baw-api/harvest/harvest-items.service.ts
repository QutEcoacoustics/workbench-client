import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  option,
  param,
  ReadonlyApi,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { ListResolver } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Harvest } from "@models/Harvest";
import { HarvestItem } from "@models/HarvestItem";
import { Project } from "@models/Project";
import { Observable } from "rxjs";

const projectId: IdParam<Project> = id;
const harvestId: IdParam<Harvest> = id;
const harvestItemPath = param;
const endpoint = stringTemplate`/projects/${projectId}/harvests/${harvestId}/items/${harvestItemPath}${option}`;
const shallowEndpoint = stringTemplate`/harvests/${harvestId}/items/${harvestItemPath}${option}`;

@Injectable()
export class HarvestItemsService
  implements ReadonlyApi<HarvestItem, [IdOr<Project>, IdOr<Harvest>]>
{
  public constructor(private api: BawApiService<HarvestItem>) {}

  public list(
    project: IdOr<Project>,
    harvest: Harvest,
    harvestItem?: HarvestItem
  ): Observable<HarvestItem[]> {
    return this.api.list(
      HarvestItem,
      endpoint(project, harvest, harvestItem?.path ?? emptyParam, emptyParam)
    );
  }

  public listByPage(
    page: number,
    project: IdOr<Project>,
    harvest: Harvest,
    harvestItem?: HarvestItem
  ): Observable<HarvestItem[]> {
    const paging = page <= 1 ? "" : `?page=${page}`;
    return this.api.list(
      HarvestItem,
      endpoint(project, harvest, harvestItem?.path ?? emptyParam, emptyParam) +
        paging
    );
  }

  public filter(
    filters: Filters<HarvestItem>,
    project: IdOr<Project>,
    harvest: IdOr<Harvest>,
    harvestItem?: HarvestItem
  ): Observable<HarvestItem[]> {
    return this.api.filter(
      HarvestItem,
      endpoint(project, harvest, harvestItem?.path ?? emptyParam, filterParam),
      filters
    );
  }

  // TODO Allow path input as id
  public show(
    model: HarvestItem,
    project: IdOr<Project>,
    harvest: IdOr<Harvest>
  ): Observable<HarvestItem> {
    return this.api.show(
      HarvestItem,
      endpoint(project, harvest, model.path, emptyParam)
    );
  }
}

@Injectable()
export class ShallowHarvestItemsService
  implements ReadonlyApi<HarvestItem, [IdOr<Harvest>]>
{
  public constructor(private api: BawApiService<HarvestItem>) {}

  public list(harvest: IdOr<Harvest>): Observable<HarvestItem[]> {
    return this.api.list(
      HarvestItem,
      shallowEndpoint(harvest, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<HarvestItem>,
    harvest: IdOr<Harvest>
  ): Observable<HarvestItem[]> {
    return this.api.filter(
      HarvestItem,
      shallowEndpoint(harvest, emptyParam, filterParam),
      filters
    );
  }

  // TODO Allow path input as id
  public show(
    model: HarvestItem,
    harvest: IdOr<Harvest>
  ): Observable<HarvestItem> {
    return this.api.show(
      HarvestItem,
      shallowEndpoint(harvest, model.path, emptyParam)
    );
  }

  public harvestCsvReportUrl(harvest: IdOr<Harvest>): string {
    const filter = this.api.filterThroughAssociation(
      {
        projection: {
          include: ["id", "harvestId", "path", "status", "audioRecordingId"],
        },
      },
      "harvests.id" as any,
      harvest
    );
    return (
      this.api.getPath(
        shallowEndpoint(harvest, emptyParam, filterParam) + ".csv?"
      ) + this.api.encodeFilter(filter, true)
    );
  }
}

export const harvestItemResolvers = new ListResolver<
  HarvestItem,
  [IdOr<Project>, IdOr<Harvest>]
>([HarvestItemsService], ["projectId", "harvestId"]).create("HarvestItem");

export const shallowHarvestItemResolvers = new ListResolver<
  HarvestItem,
  [IdOr<Harvest>]
>([ShallowHarvestItemsService], ["harvestId"]).create("ShallowHarvestItem");
