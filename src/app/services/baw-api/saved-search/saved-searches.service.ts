import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { SavedSearch } from "@models/SavedSearch";
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
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const savedSearchId: IdParamOptional<SavedSearch> = id;
const endpoint = stringTemplate`/saved_searches/${savedSearchId}${option}`;

@Injectable()
export class SavedSearchesService implements ImmutableApi<SavedSearch> {
  public constructor(private api: BawApiService<SavedSearch>) {}

  public list(): Observable<SavedSearch[]> {
    return this.api.list(SavedSearch, endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<SavedSearch>): Observable<SavedSearch[]> {
    return this.api.filter(
      SavedSearch,
      endpoint(emptyParam, filterParam),
      filters
    );
  }
  public show(model: IdOr<SavedSearch>): Observable<SavedSearch> {
    return this.api.show(SavedSearch, endpoint(model, emptyParam));
  }
  public create(model: SavedSearch): Observable<SavedSearch> {
    return this.api.create(
      SavedSearch,
      endpoint(emptyParam, emptyParam),
      (savedSearch) => endpoint(savedSearch, emptyParam),
      model
    );
  }
  public destroy(model: IdOr<SavedSearch>): Observable<SavedSearch | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }
}

export const savedSearchResolvers = new Resolvers<SavedSearch, []>(
  [SavedSearchesService],
  "savedSearchId"
).create("SavedSearch");
