import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Dataset } from "@models/Dataset";
import { DatasetItem } from "@models/DatasetItem";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  ImmutableApi,
  option,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const datasetId: IdParam<Dataset> = id;
const datasetItemId: IdParamOptional<DatasetItem> = id;
const endpoint = stringTemplate`/datasets/${datasetId}/items/${datasetItemId}${option}`;

@Injectable()
export class DatasetItemsService extends ImmutableApi<
  DatasetItem,
  [IdOr<Dataset>]
> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, DatasetItem);
  }

  list(dataset: IdOr<Dataset>): Observable<DatasetItem[]> {
    return this.apiList(endpoint(dataset, Empty, Empty));
  }
  filter(filters: Filters, dataset: IdOr<Dataset>): Observable<DatasetItem[]> {
    return this.apiFilter(endpoint(dataset, Empty, Filter), filters);
  }
  show(
    model: IdOr<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem> {
    return this.apiShow(endpoint(dataset, model, Empty));
  }
  create(model: DatasetItem, dataset: IdOr<Dataset>): Observable<DatasetItem> {
    return this.apiCreate(endpoint(dataset, Empty, Empty), model);
  }
  destroy(
    model: IdOr<DatasetItem>,
    dataset: IdOr<Dataset>
  ): Observable<DatasetItem | void> {
    return this.apiDestroy(endpoint(dataset, model, Empty));
  }
}

export const datasetItemResolvers = new Resolvers<
  DatasetItem,
  DatasetItemsService
>([DatasetItemsService], "datasetItemId").create("DatasetItem");
