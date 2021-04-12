import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { IProgressEvent, ProgressEvent } from "@models/ProgressEvent";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  ReadAndCreateApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const progressEventId: IdParamOptional<ProgressEvent> = id;
const endpoint = stringTemplate`/progress_events/${progressEventId}${option}`;

@Injectable()
export class ProgressEventsService extends ReadAndCreateApi<ProgressEvent> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, ProgressEvent, injector);
  }

  public list(): Observable<ProgressEvent[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IProgressEvent>): Observable<ProgressEvent[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<ProgressEvent>): Observable<ProgressEvent> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public create(model: ProgressEvent): Observable<ProgressEvent> {
    return this.apiCreate(endpoint(emptyParam, emptyParam), model);
  }
}

export const progressEventResolvers = new Resolvers<ProgressEvent, []>(
  [ProgressEventsService],
  "progressEventId"
).create("ProgressEvent");
