import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Dataset } from "@models/Dataset";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const datasetId: IdParamOptional<Dataset> = id;
const endpoint = stringTemplate`/datasets/${datasetId}${option}`;

@Injectable()
export class DatasetsService extends StandardApi<Dataset> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Dataset, injector);
  }

  list(): Observable<Dataset[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<Dataset[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<Dataset>): Observable<Dataset> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: Dataset): Observable<Dataset> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: Dataset): Observable<Dataset> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<Dataset>): Observable<Dataset | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const datasetResolvers = new Resolvers<Dataset, DatasetsService>(
  [DatasetsService],
  "datasetId"
).create("Dataset");
