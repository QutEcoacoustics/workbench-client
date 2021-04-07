import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Dataset } from "@models/Dataset";
import { DatasetItem, IDatasetItem } from "@models/DatasetItem";
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
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const datasetId: IdParam<Dataset> = id;
const datasetItemId: IdParamOptional<DatasetItem> = id;
const endpoint = stringTemplate`/datasets/${datasetId}/items/${datasetItemId}${option}`;

@Injectable()
export class DatasetItemsService extends ImmutableApi<
  DatasetItem,
  [IdOr<Dataset>]
> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, DatasetItem, injector);
  }

  public list(dataset: IdOr<Dataset>): Observable<DatasetItem[]> {
    return this.apiList(endpoint(dataset, emptyParam, emptyParam));
  }
  public filter(
    filters: Filters<IDatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem[]> {
    return this.apiFilter(endpoint(dataset, emptyParam, filterParam), filters);
  }
  public show(
    model: IdOr<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem> {
    return this.apiShow(endpoint(dataset, model, emptyParam));
  }
  public create(
    model: DatasetItem,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem> {
    return this.apiCreate(endpoint(dataset, emptyParam, emptyParam), model);
  }
  public destroy(
    model: IdOr<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem | void> {
    return this.apiDestroy(endpoint(dataset, model, emptyParam));
  }
}

export const datasetItemResolvers = new Resolvers<
  DatasetItem,
  [IdOr<Dataset>],
  DatasetItemsService
>([DatasetItemsService], "datasetItemId").create("DatasetItem");
