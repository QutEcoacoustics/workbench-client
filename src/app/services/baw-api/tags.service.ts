import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Id } from "src/app/interfaces/apiInterfaces";
import { Tag, TagType } from "src/app/models/Tag";
import {
  Empty,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "./api-common";
import { Filters } from "./baw-api.service";
import { filterMock, showMock } from "./mock/api-commonMock";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
  Resolvers,
} from "./resolver-common";

const tagId: IdParamOptional<Tag> = id;
const endpoint = stringTemplate`/tags/${tagId}${option}`;

@Injectable()
export class TagsService extends StandardApi<Tag, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Tag);
  }

  list(): Observable<Tag[]> {
    return this.filter({});
  }
  filter(filters: Filters): Observable<Tag[]> {
    return filterMock<Tag>(filters, (index) => createTag(index));
  }
  show(model: IdOr<Tag>): Observable<Tag> {
    return showMock(model, (modelId) => createTag(modelId));
  }
  create(model: Tag): Observable<Tag> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: Tag): Observable<Tag> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<Tag>): Observable<Tag | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
  /**
   * List type of tags
   * TODO Replace with reference to baw server
   */
  tagTypes(): Observable<TagType[]> {
    return of([
      "general",
      "common_name",
      "species_name",
      "looks_like",
      "sounds_like",
    ]).pipe(map((types) => types.map((type) => new TagType({ name: type }))));
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
    notes: new Blob(["PLACEHOLDER NOTES"]),
    creatorId: 1,
    updaterId: 1,
    createdAt: "2020-03-10T10:51:04.576+10:00",
    updatedAt: "2020-03-10T10:51:04.576+10:00",
  });
}

class TagResolvers {
  public create(name: string) {
    const additionalProvider = new Resolvers<Tag, TagsService>(
      [TagsService],
      "tagId"
    ).create(name);
    const tagTypeProvider = new TagTypeResolvers().create(name);
    const providers = [
      ...additionalProvider.providers,
      ...tagTypeProvider.providers,
    ];

    return {
      ...additionalProvider,
      ...tagTypeProvider,
      providers,
    };
  }
}

class TagTypeResolvers extends BawResolver<
  TagType[],
  Tag,
  TagsService,
  { tagTypes: string }
> {
  constructor() {
    super([TagsService], undefined, undefined);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<TagType[]>>>,
    deps: Type<TagsService>[]
  ): { tagTypes: string } & {
    providers: BawProvider[];
  } {
    return {
      tagTypes: name + "TagTypesResolver",
      providers: [
        {
          provide: name + "TagTypesResolver",
          useClass: resolver,
          deps,
        },
      ],
    };
  }

  public resolverFn(
    __: ActivatedRouteSnapshot,
    api: TagsService
  ): Observable<TagType[]> {
    return api.tagTypes();
  }
}

export const tagResolvers = new TagResolvers().create("Tag");
