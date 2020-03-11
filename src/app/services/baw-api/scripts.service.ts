import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Script } from "src/app/models/Script";
import { Empty, id, IdOr, IdParamOptional, StandardApi } from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, listMock } from "./mock/api-commonMock";
import { Resolvers } from "./resolver-common";

const scriptId: IdParamOptional<Script> = id;
const endpoint = stringTemplate`/scripts/${scriptId}`;

@Injectable()
export class ScriptsService extends StandardApi<Script, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Script);
  }

  list(): Observable<Script[]> {
    return listMock<Script>(
      index =>
        new Script({
          id: index,
          name: "PLACEHOLDER SCRIPT",
          description: "PLACEHOLDER DESCRIPTION",
          analysisIdentifier: "audio2csv",
          version: 0.1,
          verified: index % 3 === 0,
          groupId: index % 5,
          creatorId: 1,
          createdAt: "2020-03-10T10:51:04.576+10:00",
          executableCommand: "placeholder",
          executableSettings: "placeholder",
          executableSettingsMediaType: "text/plain",
          analysisActionParams: JSON.stringify({})
        })
    );
    // return this.apiList(endpoint(Empty));
  }

  filter(filters: Filters): Observable<Script[]> {
    return filterMock<Script>(
      filters,
      index =>
        new Script({
          id: index,
          name: "PLACEHOLDER SCRIPT",
          description: "PLACEHOLDER DESCRIPTION",
          analysisIdentifier: "audio2csv",
          version: 0.1,
          verified: index % 3 === 0,
          groupId: index % 5,
          creatorId: 1,
          createdAt: "2020-03-10T10:51:04.576+10:00",
          executableCommand: "placeholder",
          executableSettings: "placeholder",
          executableSettingsMediaType: "text/plain",
          analysisActionParams: JSON.stringify({})
        })
    );
    // return this.apiList(endpoint(Empty));
  }

  show(model: IdOr<Script>): Observable<Script> {
    return this.apiShow(endpoint(model));
  }
  create(model: Script): Observable<Script> {
    return this.apiCreate(endpoint(Empty), model);
  }
  update(model: Script): Observable<Script> {
    return this.apiUpdate(endpoint(model), model);
  }
  destroy(model: IdOr<Script>): Observable<Script | void> {
    return this.apiDestroy(endpoint(model));
  }
}

export const scriptResolvers = new Resolvers<Script, ScriptsService>(
  [ScriptsService],
  "scriptId"
).create("Script");
