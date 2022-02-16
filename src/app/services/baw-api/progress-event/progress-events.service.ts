import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ProgressEvent } from "@models/ProgressEvent";
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
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const progressEventId: IdParamOptional<ProgressEvent> = id;
const endpoint = stringTemplate`/progress_events/${progressEventId}${option}`;

@Injectable()
export class ProgressEventsService implements ReadAndCreateApi<ProgressEvent> {
  public constructor(private api: BawApiService<ProgressEvent>) {}

  public list(): Observable<ProgressEvent[]> {
    return this.api.list(ProgressEvent, endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<ProgressEvent>): Observable<ProgressEvent[]> {
    return this.api.filter(
      ProgressEvent,
      endpoint(emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<ProgressEvent>): Observable<ProgressEvent> {
    return this.api.show(ProgressEvent, endpoint(model, emptyParam));
  }
  public create(model: ProgressEvent): Observable<ProgressEvent> {
    return this.api.create(
      ProgressEvent,
      endpoint(emptyParam, emptyParam),
      (progressEvent) => endpoint(progressEvent, emptyParam),
      model
    );
  }
}

export const progressEventResolvers = new Resolvers<ProgressEvent, []>(
  [ProgressEventsService],
  "progressEventId"
).create("ProgressEvent");
