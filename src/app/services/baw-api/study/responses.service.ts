import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Response } from "@models/Response";
import { Study } from "@models/Study";
import { Observable } from "rxjs";
import { emptyParam, filterParam, id, IdOr, IdParam, IdParamOptional, option, StandardApi } from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const studyId: IdParam<Study> = id;
const responseId: IdParamOptional<Response> = id;
const endpoint = stringTemplate`/studies/${studyId}/responses/${responseId}${option}`;
const endpointShallow = stringTemplate`/responses/${responseId}${option}`;

@Injectable()
export class ResponsesService implements StandardApi<Response, [IdOr<Study>]> {
  public constructor(private api: BawApiService<Response>) {}

  public list(study: IdOr<Study>): Observable<Response[]> {
    return this.api.list(Response, endpoint(study, emptyParam, emptyParam));
  }

  public filter(filters: Filters<Response>, study: IdOr<Study>): Observable<Response[]> {
    return this.api.filter(Response, endpoint(study, emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Response>, study: IdOr<Study>): Observable<Response> {
    return this.api.show(Response, endpoint(study, model, emptyParam));
  }

  public create(model: Response, study: IdOr<Study>): Observable<Response> {
    return this.api.create(
      Response,
      endpoint(study, emptyParam, emptyParam),
      (response) => endpoint(study, response, emptyParam),
      model,
    );
  }

  public update(model: Response, study: IdOr<Study>): Observable<Response> {
    return this.api.update(Response, endpoint(study, model, emptyParam), model);
  }

  public destroy(model: IdOr<Response>, study: IdOr<Study>): Observable<Response | void> {
    return this.api.destroy(endpoint(study, model, emptyParam));
  }
}

@Injectable()
export class ShallowResponsesService implements StandardApi<Response> {
  public constructor(private api: BawApiService<Response>) {}

  public list(): Observable<Response[]> {
    return this.api.list(Response, endpointShallow(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Response>): Observable<Response[]> {
    return this.api.filter(Response, endpointShallow(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Response>): Observable<Response> {
    return this.api.show(Response, endpointShallow(model, emptyParam));
  }

  public create(model: Response): Observable<Response> {
    return this.api.create(
      Response,
      endpointShallow(emptyParam, emptyParam),
      (response) => endpointShallow(response, emptyParam),
      model,
    );
  }

  public update(model: Response): Observable<Response> {
    return this.api.update(Response, endpointShallow(model, emptyParam), model);
  }

  public destroy(model: IdOr<Response>): Observable<Response | void> {
    return this.api.destroy(endpointShallow(model, emptyParam));
  }
}

export const responseResolvers = new Resolvers<Response, [IdOr<Study>]>([ResponsesService], "responseId", [
  "studyId",
]).create("Response");

export const shallowResponseResolvers = new Resolvers<Response, []>([ShallowResponsesService], "responseId").create(
  "ShallowResponse",
);
