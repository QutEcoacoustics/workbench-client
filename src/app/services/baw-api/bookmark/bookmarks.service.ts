import { Injectable } from "@angular/core";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Bookmark } from "@models/Bookmark";
import type { User } from "@models/User";
import { Observable } from "rxjs";
import {
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { Resolvers } from "../resolvers/resolver-common";

const bookmarkId: IdParamOptional<Bookmark> = id;
const endpoint = stringTemplate`/bookmarks/${bookmarkId}${option}`;

@Injectable()
export class BookmarksService implements StandardApi<Bookmark> {
  public constructor(private api: BawApiService<Bookmark>) {}

  public list(): Observable<Bookmark[]> {
    return this.api.list(Bookmark, endpoint(emptyParam, emptyParam));
  }

  public filter(filters: Filters<Bookmark>): Observable<Bookmark[]> {
    return this.api.filter(
      Bookmark,
      endpoint(emptyParam, filterParam),
      filters
    );
  }

  public show(model: IdOr<Bookmark>): Observable<Bookmark> {
    return this.api.show(Bookmark, endpoint(model, emptyParam));
  }

  public create(model: Bookmark): Observable<Bookmark> {
    return this.api.create(
      Bookmark,
      endpoint(emptyParam, emptyParam),
      (bookmark) => endpoint(bookmark, emptyParam),
      model
    );
  }

  public update(model: Bookmark): Observable<Bookmark> {
    return this.api.update(Bookmark, endpoint(model, emptyParam), model);
  }

  public destroy(model: IdOr<Bookmark>): Observable<Bookmark | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  /**
   * Filter bookmarks by creator
   *
   * @param filters Bookmark filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<Bookmark>,
    user: IdOr<User>
  ): Observable<Bookmark[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "creatorId", user)
    );
  }
}

export const bookmarkResolvers = new Resolvers<Bookmark, []>(
  [BookmarksService],
  "bookmarkId"
).create("Bookmark");
