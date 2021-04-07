import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ITagGroup, TagGroup } from "@models/TagGroup";
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
import { Filters } from "../baw-api.service";
import { Resolvers } from "../resolver-common";

const tagGroupId: IdParamOptional<TagGroup> = id;
const endpoint = stringTemplate`/tag_groups/${tagGroupId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 * TODO https://github.com/QutEcoacoustics/baw-server/issues/442
 */
@Injectable()
export class TagGroupsService extends StandardApi<TagGroup> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, TagGroup, injector);
  }

  public list(): Observable<TagGroup[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<ITagGroup>): Observable<TagGroup[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<TagGroup>): Observable<TagGroup> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public create(model: TagGroup): Observable<TagGroup> {
    return this.apiCreate(endpoint(emptyParam, emptyParam), model);
  }
  public update(model: TagGroup): Observable<TagGroup> {
    return this.apiUpdate(endpoint(model, emptyParam), model);
  }
  public destroy(model: IdOr<TagGroup>): Observable<TagGroup | void> {
    return this.apiDestroy(endpoint(model, emptyParam));
  }
}

export const tagGroupResolvers = new Resolvers<TagGroup, [], TagGroupsService>(
  [TagGroupsService],
  "tagGroupId"
).create("TagGroup");
