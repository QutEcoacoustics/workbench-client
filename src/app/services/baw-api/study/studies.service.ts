import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IStudy, Study } from "@models/Study";
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

const studyId: IdParamOptional<Study> = id;
const endpoint = stringTemplate`/studies/${studyId}${option}`;

@Injectable()
export class StudiesService extends StandardApi<Study> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Study, injector);
  }

  list(): Observable<Study[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters<IStudy>): Observable<Study[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<Study>): Observable<Study> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: Study): Observable<Study> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: Study): Observable<Study> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<Study>): Observable<Study | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const studyResolvers = new Resolvers<Study, StudiesService>(
  [StudiesService],
  "studyId"
).create("Study");
