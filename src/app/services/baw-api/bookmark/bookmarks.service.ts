import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Bookmark, IBookmark } from "@models/Bookmark";
import type { User } from "@models/User";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  filterByForeignKey,
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
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Bookmark, injector);
  }

  public list(): Observable<Bookmark[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<IBookmark>): Observable<Bookmark[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Bookmark>): Observable<Bookmark> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public create(model: Bookmark): Observable<Bookmark> {
    return this.apiCreate(endpoint(emptyParam, emptyParam), model);
  }
  public update(model: Bookmark): Observable<Bookmark> {
    return this.apiUpdate(endpoint(model, emptyParam), model);
  }
  public destroy(model: IdOr<Bookmark>): Observable<Bookmark | void> {
    return this.apiDestroy(endpoint(model, emptyParam));
  }

  /**
   * Filter bookmarks by creator
   *
   * @param filters Bookmark filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<IBookmark>,
    user?: IdOr<User>
  ): Observable<Bookmark[]> {
    return this.filter(
      filterByForeignKey<IBookmark>(filters, "creatorId", user)
    );
  }
}

export const bookmarkResolvers = new Resolvers<Bookmark, BookmarksService>(
  [BookmarksService],
  "bookmarkId"
).create("Bookmark");
