import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IResponse, Response } from "@models/Response";
import { Study } from "@models/Study";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const studyId: IdParam<Study> = id;
const responseId: IdParamOptional<Response> = id;
const endpoint = stringTemplate`/studies/${studyId}/responses/${responseId}${option}`;
const endpointShallow = stringTemplate`/responses/${responseId}${option}`;

@Injectable()
export class ResponsesService extends StandardApi<Response, [IdOr<Study>]> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Response, injector);
  }

  list(study: IdOr<Study>): Observable<Response[]> {
    return this.apiList(endpoint(study, Empty, Empty));
  }
  filter(
    filters: Filters<IResponse>,
    study: IdOr<Study>
  ): Observable<Response[]> {
    return this.apiFilter(endpoint(study, Empty, Filter), filters);
  }
  show(model: IdOr<Response>, study: IdOr<Study>): Observable<Response> {
    return this.apiShow(endpoint(study, model, Empty));
  }
  create(model: Response, study: IdOr<Study>): Observable<Response> {
    return this.apiCreate(endpoint(study, Empty, Empty), model);
  }
  update(model: Response, study: IdOr<Study>): Observable<Response> {
    return this.apiUpdate(endpoint(study, model, Empty), model);
  }
  destroy(
    model: IdOr<Response>,
    study: IdOr<Study>
  ): Observable<Response | void> {
    return this.apiDestroy(endpoint(study, model, Empty));
  }
}

@Injectable()
export class ShallowResponsesService extends StandardApi<Response> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Response, injector);
  }

  list(): Observable<Response[]> {
    return this.apiList(endpointShallow(Empty, Empty));
  }
  filter(filters: Filters<IResponse>): Observable<Response[]> {
    return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  show(model: IdOr<Response>): Observable<Response> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  create(model: Response): Observable<Response> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  update(model: Response): Observable<Response> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  destroy(model: IdOr<Response>): Observable<Response | void> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}

export const responseResolvers = new Resolvers<Response, ResponsesService>(
  [ResponsesService],
  "responseId",
  ["studyId"]
).create("Response");

export const shallowResponseResolvers = new Resolvers<
  Response,
  ShallowResponsesService
>([ShallowResponsesService], "responseId").create("ShallowResponse");
