import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { SavedSearch } from "@models/SavedSearch";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { Resolvers } from "./resolver-common";

const savedSearchId: IdParamOptional<SavedSearch> = id;
const endpoint = stringTemplate`/saved_searches/${savedSearchId}${option}`;

@Injectable()
export class SavedSearchesService extends StandardApi<SavedSearch, []> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, SavedSearch, injector);
  }

  list(): Observable<SavedSearch[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<SavedSearch[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<SavedSearch>): Observable<SavedSearch> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: SavedSearch): Observable<SavedSearch> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: SavedSearch): Observable<SavedSearch> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<SavedSearch>): Observable<SavedSearch | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const savedSearchResolvers = new Resolvers<
  SavedSearch,
  SavedSearchesService
>([SavedSearchesService], "savedSearchId").create("SavedSearch");
