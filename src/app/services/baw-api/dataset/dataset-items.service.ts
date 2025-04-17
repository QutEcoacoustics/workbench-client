import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Dataset } from "@models/Dataset";
import { DatasetItem } from "@models/DatasetItem";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  ImmutableApi,
  option,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolvers/resolver-common";

const datasetId: IdParam<Dataset> = id;
const datasetItemId: IdParamOptional<DatasetItem> = id;
const endpoint = stringTemplate`/datasets/${datasetId}/items/${datasetItemId}${option}`;

@Injectable()
export class DatasetItemsService
  implements ImmutableApi<DatasetItem, [IdOr<Dataset>]>
{
  public constructor(private api: BawApiService<DatasetItem>) {}

  public list(dataset: IdOr<Dataset>): Observable<DatasetItem[]> {
    return this.api.list(
      DatasetItem,
      endpoint(dataset, emptyParam, emptyParam)
    );
  }

  public filter(
    filters: Filters<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem[]> {
    return this.api.filter(
      DatasetItem,
      endpoint(dataset, emptyParam, filterParam),
      filters
    );
  }

  public show(
    model: IdOr<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem> {
    return this.api.show(DatasetItem, endpoint(dataset, model, emptyParam));
  }

  public create(
    model: DatasetItem,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem> {
    return this.api.create(
      DatasetItem,
      endpoint(dataset, emptyParam, emptyParam),
      (datasetItem) => endpoint(dataset, datasetItem, emptyParam),
      model
    );
  }

  public destroy(
    model: IdOr<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem | void> {
    return this.api.destroy(endpoint(dataset, model, emptyParam));
  }
}

export const datasetItemResolvers = new Resolvers<DatasetItem, [IdOr<Dataset>]>(
  [DatasetItemsService],
  "datasetItemId"
).create("DatasetItem");
