import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ProgressEvent } from "@models/ProgressEvent";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
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
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, ProgressEvent, injector);
  }

  list(): Observable<ProgressEvent[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<ProgressEvent[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<ProgressEvent>): Observable<ProgressEvent> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: ProgressEvent): Observable<ProgressEvent> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
}

export const progressEventResolvers = new Resolvers<
  ProgressEvent,
  ProgressEventsService
>([ProgressEventsService], "progressEventId").create("ProgressEvent");
