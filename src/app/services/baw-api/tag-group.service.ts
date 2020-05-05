import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { TagGroup } from "@models/TagGroup";
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

const tagGroupId: IdParamOptional<TagGroup> = id;
const endpoint = stringTemplate`/tag_groups/${tagGroupId}${option}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 */
@Injectable()
export class TagGroupService extends StandardApi<TagGroup> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, TagGroup);
  }

  list(): Observable<TagGroup[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<TagGroup[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<TagGroup>): Observable<TagGroup> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: TagGroup): Observable<TagGroup> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: TagGroup): Observable<TagGroup> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<TagGroup>): Observable<TagGroup | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const tagGroupResolvers = new Resolvers<TagGroup, TagGroupService>(
  [TagGroupService],
  "tagGroupId"
).create("TagGroup");
