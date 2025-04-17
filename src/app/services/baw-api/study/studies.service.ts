import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Study } from "@models/Study";
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
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolvers/resolver-common";

const studyId: IdParamOptional<Study> = id;
const endpoint = stringTemplate`/studies/${studyId}${option}`;

@Injectable()
export class StudiesService implements StandardApi<Study> {
  public constructor(private api: BawApiService<Study>) {}

  public list(): Observable<Study[]> {
    return this.api.list(Study, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Study>): Observable<Study[]> {
    return this.api.filter(Study, endpoint(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Study>): Observable<Study> {
    return this.api.show(Study, endpoint(model, emptyParam));
  }

  public create(model: Study): Observable<Study> {
    return this.api.create(
      Study,
      endpoint(emptyParam, emptyParam),
      (study) => endpoint(study, emptyParam),
      model
    );
  }

  public update(model: Study): Observable<Study> {
    return this.api.update(Study, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Study>): Observable<Study | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const studyResolvers = new Resolvers<Study, []>(
  [StudiesService],
  "studyId"
).create("Study");
