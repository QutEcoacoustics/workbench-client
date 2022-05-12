import { Injectable } from "@angular/core";
import {
  emptyParam,
  filterParam,
  IdOr,
  IdParam,
  ListOnlyApi,
  option,
} from "@baw-api/api-common";
import { BawApiService, Filters } from "@baw-api/baw-api.service";
import { ListResolver } from "@baw-api/resolver-common";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Harvest } from "@models/harvest/Harvest";
import { HarvestItem } from "@models/harvest/HarvestItem";
import { Project } from "@models/Project";
import { id } from "@swimlane/ngx-datatable";
import { Observable } from "rxjs";

const projectId: IdParam<Project> = id;
const harvestId: IdParam<Harvest> = id;
const endpoint = stringTemplate`/projects/${projectId}/harvest/${harvestId}/harvest_items/${option}`;
const shallowEndpoint = stringTemplate`/harvest/${harvestId}/harvest_items/${option}`;

@Injectable()
export class HarvestItemsService
  implements ListOnlyApi<HarvestItem, [IdOr<Project>, IdOr<Harvest>]>
{
  public constructor(private api: BawApiService<HarvestItem>) {}

  public list(
    project: IdOr<Project>,
    harvest: IdOr<Harvest>
  ): Observable<HarvestItem[]> {
    return this.api.list(HarvestItem, endpoint(project, harvest, emptyParam));
  }

  public filter(
    filters: Filters<HarvestItem>,
    project: IdOr<Project>,
    harvest: IdOr<Harvest>
  ): Observable<HarvestItem[]> {
    return this.api.filter(
      HarvestItem,
      endpoint(project, harvest, filterParam),
      filters
    );
  }
}

@Injectable()
export class ShallowHarvestItemsService
  implements ListOnlyApi<HarvestItem, [IdOr<Harvest>]>
{
  public constructor(private api: BawApiService<HarvestItem>) {}

  public list(harvest: IdOr<Harvest>): Observable<HarvestItem[]> {
    return this.api.list(HarvestItem, shallowEndpoint(harvest, emptyParam));
  }

  public filter(
    filters: Filters<HarvestItem>,
    harvest: IdOr<Harvest>
  ): Observable<HarvestItem[]> {
    return this.api.filter(
      HarvestItem,
      shallowEndpoint(harvest, filterParam),
      filters
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
