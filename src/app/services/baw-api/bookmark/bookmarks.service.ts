import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Bookmark } from "@models/Bookmark";
import type { User } from "@models/User";
import { Observable } from "rxjs";
import {
  Empty,
  Filter,
  filterById,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const bookmarkId: IdParamOptional<Bookmark> = id;
const endpoint = stringTemplate`/bookmarks/${bookmarkId}${option}`;

@Injectable()
export class BookmarksService extends StandardApi<Bookmark> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Bookmark, injector);
  }

  list(): Observable<Bookmark[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(
    filters: Filters<Bookmark>,
    user?: IdOr<User>
  ): Observable<Bookmark[]> {
    return this.apiFilter(
      endpoint(Empty, Filter),
      user ? filterById<Bookmark>(filters, "creatorId", user) : filters
    );
  }
  show(model: IdOr<Bookmark>): Observable<Bookmark> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: Bookmark): Observable<Bookmark> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: Bookmark): Observable<Bookmark> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<Bookmark>): Observable<Bookmark | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const bookmarkResolvers = new Resolvers<Bookmark, BookmarksService>(
  [BookmarksService],
  "bookmarkId"
).create("Bookmark");
