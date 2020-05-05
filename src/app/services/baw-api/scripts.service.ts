import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Script } from "@models/Script";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  ReadAndCreateApi,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const scriptId: IdParamOptional<Script> = id;
const endpoint = stringTemplate`/scripts/${scriptId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 */
@Injectable()
export class ScriptsService extends ReadAndCreateApi<Script> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Script);
  }

  list(): Observable<Script[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<Script[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<Script>): Observable<Script> {
    return this.apiShow(endpoint(model, Empty));
  }
  // TODO https://github.com/QutEcoacoustics/baw-server/issues/435
  create(model: Script): Observable<Script> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
}

export const scriptResolvers = new Resolvers<Script, ScriptsService>(
  [ScriptsService],
  "scriptId"
).create("Script");
