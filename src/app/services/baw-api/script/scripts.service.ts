import { Injectable } from "@angular/core";
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
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolvers/resolver-common";

const scriptId: IdParamOptional<Script> = id;
const endpoint = stringTemplate`/scripts/${scriptId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 */
@Injectable()
export class ScriptsService implements NonDestructibleApi<Script> {
  public constructor(private api: BawApiService<Script>) {}

  public list(): Observable<Script[]> {
    return this.api.list(Script, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<IScript>): Observable<Script[]> {
    return this.api.filter(Script, endpoint(emptyParam, filterParam), filters);
  }

  public show(model: IdOr<Script>): Observable<Script> {
    return this.api.show(Script, endpoint(model, emptyParam));
  }

  // TODO https://github.com/QutEcoacoustics/baw-server/issues/435
  public create(model: Script): Observable<Script> {
    return this.api.create(
      Script,
      endpoint(emptyParam, emptyParam),
      (script) => endpoint(script, emptyParam),
      model
    );
  }

  // TODO https://github.com/QutEcoacoustics/baw-server/issues/435
  public update(model: Script): Observable<Script> {
    return this.api.update(Script, endpoint(model, emptyParam), model);
  }
}

export const scriptResolvers = new Resolvers<Script, []>(
  [ScriptsService],
  "scriptId"
).create("Script");
