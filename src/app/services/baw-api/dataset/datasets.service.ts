import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Dataset } from "@models/Dataset";
import { Observable } from "rxjs";
import { emptyParam, filterParam, id, IdOr, IdParamOptional, option, StandardApi } from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const datasetId: IdParamOptional<Dataset> = id;
const endpoint = stringTemplate`/datasets/${datasetId}${option}`;

@Injectable()
export class DatasetsService implements StandardApi<Dataset> {
  public constructor(private api: BawApiService<Dataset>) {}

  public list(): Observable<Dataset[]> {
    return this.api.list(Dataset, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Dataset>): Observable<Dataset[]> {
    return this.api.filter(Dataset, endpoint(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Dataset>): Observable<Dataset> {
    return this.api.show(Dataset, endpoint(model, emptyParam));
  }

  public create(model: Dataset): Observable<Dataset> {
    return this.api.create(
      Dataset,
      endpoint(emptyParam, emptyParam),
      (dataset) => endpoint(dataset, emptyParam),
      model,
    );
  }

  public update(model: Dataset): Observable<Dataset> {
    return this.api.update(Dataset, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Dataset>): Observable<Dataset | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const datasetResolvers = new Resolvers<Dataset, []>([DatasetsService], "datasetId").create("Dataset");
