import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { BawApiStateService } from "@baw-api/baw-api-state.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ISavedSearch, SavedSearch } from "@models/SavedSearch";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  ImmutableApi,
  option,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const savedSearchId: IdParamOptional<SavedSearch> = id;
const endpoint = stringTemplate`/saved_searches/${savedSearchId}${option}`;

@Injectable()
export class SavedSearchesService extends ImmutableApi<SavedSearch> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector,
    state: BawApiStateService
  ) {
    super(http, apiRoot, SavedSearch, injector, state);
  }

  public list(): Observable<SavedSearch[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<ISavedSearch>): Observable<SavedSearch[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<SavedSearch>): Observable<SavedSearch> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public create(model: SavedSearch): Observable<SavedSearch> {
    return this.apiCreate(
      endpoint(emptyParam, emptyParam),
      (savedSearch) => endpoint(savedSearch, emptyParam),
      model
    );
  }
  public destroy(model: IdOr<SavedSearch>): Observable<SavedSearch | void> {
    return this.apiDestroy(endpoint(model, emptyParam));
  }
}

export const savedSearchResolvers = new Resolvers<SavedSearch, []>(
  [SavedSearchesService],
  "savedSearchId"
).create("SavedSearch");
