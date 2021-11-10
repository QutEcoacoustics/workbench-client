import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IScript, Script } from "@models/Script";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  NonDestructibleApi,
  option,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const scriptId: IdParamOptional<Script> = id;
const endpoint = stringTemplate`/scripts/${scriptId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 */
@Injectable()
export class ScriptsService extends NonDestructibleApi<Script> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Script, injector);
  }

  public list(): Observable<Script[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IScript>): Observable<Script[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Script>): Observable<Script> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  // TODO https://github.com/QutEcoacoustics/baw-server/issues/435
  public create(model: Script): Observable<Script> {
    return this.apiCreate(
      endpoint(emptyParam, emptyParam),
      (script) => endpoint(script, emptyParam),
      model
    );
  }
  // TODO https://github.com/QutEcoacoustics/baw-server/issues/435
  public update(model: Script): Observable<Script> {
    return this.apiUpdate(endpoint(model, emptyParam), model);
  }
}

export const scriptResolvers = new Resolvers<Script, []>(
  [ScriptsService],
  "scriptId"
).create("Script");
