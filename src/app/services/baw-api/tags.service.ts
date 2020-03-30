import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { Tag } from "src/app/models/Tag";
import { Empty, id, IdOr, IdParamOptional, StandardApi } from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, showMock } from "./mock/api-commonMock";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
  Resolvers
} from "./resolver-common";

const tagId: IdParamOptional<Tag> = id;
const endpoint = stringTemplate`/tags/${tagId}`;
export type TypeOfTag = string;

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
  typeOfTags(): Observable<TypeOfTag[]> {
    return of([
      "General",
      "Common Name",
      "Species Name",
      "Looks Like",
      "Sounds Like"
    ]).pipe(delay(1000));
  }
}

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

class TagResolvers {
  public create(name: string) {
    const additionalProvider = new Resolvers<Tag, TagsService>(
      [TagsService],
      "tagId"
    ).create(name);
    const typeOfTagsProvider = new TypeOfTagsResolver().create(name);
    const providers = [
      ...additionalProvider.providers,
      ...typeOfTagsProvider.providers
    ];

    return {
      ...additionalProvider,
      ...typeOfTagsProvider,
      providers
    };
  }
}

class TypeOfTagsResolver extends BawResolver<
  TypeOfTag[],
  Tag,
  TagsService,
  { typeOfTags: string }
> {
  constructor() {
    super([TagsService], undefined, undefined);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<TypeOfTag[]>>>,
    deps: Type<TagsService>[]
  ): { typeOfTags: string } & {
    providers: BawProvider[];
  } {
    return {
      typeOfTags: name + "TypeOfTagsResolver",
      providers: [
        {
          provide: name + "TypeOfTagsResolver",
          useClass: resolver,
          deps
        }
      ]
    };
  }

  public resolverFn(
    _: ActivatedRouteSnapshot,
    api: TagsService,
    __: number,
    ___: number[]
  ): Observable<TypeOfTag[]> {
    return api.typeOfTags();
  }
}

export const tagResolvers = new TagResolvers().create("Tag");
