import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { TagGroup } from "src/app/models/TagGroup";
import { Empty, id, IdOr, IdParamOptional, StandardApi } from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock } from "./mock/api-commonMock";
import { Resolvers } from "./resolver-common";

const tagGroupId: IdParamOptional<TagGroup> = id;
const endpoint = stringTemplate`/tag_groups/${tagGroupId}`;

/**
 * Scripts Service.
 * Handles API routes pertaining to scripts.
 */
@Injectable()
export class TagGroupService extends StandardApi<TagGroup, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, TagGroup);
  }

  list(): Observable<TagGroup[]> {
    return this.filter({});
  }

  filter(filters: Filters): Observable<TagGroup[]> {
    return filterMock<TagGroup>(filters, modelId => createTagGroup(modelId));
  }

  show(model: IdOr<TagGroup>): Observable<TagGroup> {
    return this.apiShow(endpoint(model));
  }
  create(model: TagGroup): Observable<TagGroup> {
    return this.apiCreate(endpoint(Empty), model);
  }
  update(model: TagGroup): Observable<TagGroup> {
    return this.apiUpdate(endpoint(model), model);
  }
  destroy(model: IdOr<TagGroup>): Observable<TagGroup | void> {
    return this.apiDestroy(endpoint(model));
  }
}

function createTagGroup(modelId: Id) {
  return new TagGroup({
    id: modelId,
    groupIdentifier: "PLACEHOLDER",
    createdAt: "2020-03-10T10:51:04.576+10:00",
    creatorId: 1,
    tagId: modelId
  });
}

export const tagGroupResolvers = new Resolvers<TagGroup, TagGroupService>(
  [TagGroupService],
  "tagGroupId"
).create("TagGroup");
