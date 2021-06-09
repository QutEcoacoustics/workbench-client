import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Dataset, IDataset } from "@models/Dataset";
import { ConfigService } from "@services/config/config.service";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
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
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    config: ConfigService
  ) {
    super(http, apiRoot, Dataset, injector, config);
  }

  public list(): Observable<Dataset[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IDataset>): Observable<Dataset[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Dataset>): Observable<Dataset> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public create(model: Dataset): Observable<Dataset> {
    return this.apiCreate(endpoint(emptyParam, emptyParam), model);
  }
  public update(model: Dataset): Observable<Dataset> {
    return this.apiUpdate(endpoint(model, emptyParam), model);
  }
  public destroy(model: IdOr<Dataset>): Observable<Dataset | void> {
    return this.apiDestroy(endpoint(model, emptyParam));
  }
}

export const datasetResolvers = new Resolvers<Dataset, []>(
  [DatasetsService],
  "datasetId"
).create("Dataset");
