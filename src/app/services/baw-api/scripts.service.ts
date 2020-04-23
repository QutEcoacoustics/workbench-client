import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { Script } from "@models/Script";
import { Observable } from "rxjs";
import {
  Empty,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, listMock } from "./mock/api-commonMock";
import { Resolvers } from "./resolver-common";

const scriptId: IdParamOptional<Script> = id;
const endpoint = stringTemplate`/scripts/${scriptId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 */
@Injectable()
export class ScriptsService extends StandardApi<Script, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Script);
  }

  list(): Observable<Script[]> {
    return listMock<Script>((modelId) => createScript(modelId));
    // return this.apiList(endpoint(Empty, Empty));
  }

  filter(filters: Filters): Observable<Script[]> {
    return filterMock<Script>(filters, (modelId) => createScript(modelId));
    // return this.apiList(endpoint(Empty, Filter));
  }

  show(model: IdOr<Script>): Observable<Script> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: Script): Observable<Script> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: Script): Observable<Script> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<Script>): Observable<Script | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const scriptResolvers = new Resolvers<Script, ScriptsService>(
  [ScriptsService],
  "scriptId"
).create("Script");

function createScript(modelId: Id) {
  return new Script({
    id: modelId,
    name: "PLACEHOLDER SCRIPT",
    description: "PLACEHOLDER DESCRIPTION",
    analysisIdentifier: "audio2csv",
    version: 0.1,
    verified: modelId % 3 === 0,
    groupId: modelId % 5,
    creatorId: 1,
    createdAt: "2020-03-10T10:51:04.576+10:00",
    executableCommand: "placeholder",
    executableSettings: "placeholder",
    executableSettingsMediaType: "text/plain",
    analysisActionParams: JSON.stringify({}),
  });
}
