import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { Tag } from "src/app/models/Tag";
import { Empty, id, IdOr, IdParamOptional, StandardApi } from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, showMock } from "./mock/api-commonMock";
import { Resolvers } from "./resolver-common";

const tagId: IdParamOptional<Tag> = id;
const endpoint = stringTemplate`/tags/${tagId}`;

@Injectable()
export class TagsService extends StandardApi<Tag, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Tag);
  }

  list(): Observable<Tag[]> {
    return this.filter({});
  }

  filter(filters: Filters): Observable<Tag[]> {
    return filterMock<Tag>(filters, index => createTag(index));
  }

  show(model: IdOr<Tag>): Observable<Tag> {
    return showMock(model, modelId => createTag(modelId));
    // return this.apiShow(endpoint(model));
  }
  create(model: Tag): Observable<Tag> {
    return this.apiCreate(endpoint(Empty), model);
  }
  update(model: Tag): Observable<Tag> {
    return this.apiUpdate(endpoint(model), model);
  }
  destroy(model: IdOr<Tag>): Observable<Tag | void> {
    return this.apiDestroy(endpoint(model));
  }

  /**
   * List type of tags
   */
  typeOfTags(): Observable<string[]> {
    return of([
      "General",
      "Common Name",
      "Species Name",
      "Looks Like",
      "Sounds Like"
    ]);
  }
}

export const tagResolvers = new Resolvers<Tag, TagsService>(
  [TagsService],
  "tagId"
).create("Tag");

function createTag(modelId: Id) {
  return new Tag({
    id: modelId,
    text: "PLACEHOLDER TAG",
    count: Math.floor(Math.random() * 10000),
    isTaxanomic: modelId % 5 === 0,
    typeOfTag: "general",
    retired: modelId % 5 === 0,
    notes: "PLACEHOLDER NOTES",
    creatorId: 1,
    updaterId: 1,
    createdAt: "2020-03-10T10:51:04.576+10:00",
    updatedAt: "2020-03-10T10:51:04.576+10:00"
  });
}
