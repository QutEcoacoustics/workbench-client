import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Tag, TagType } from "src/app/models/Tag";
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
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<Tag[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<Tag>): Observable<Tag> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: Tag): Observable<Tag> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  // TODO https://github.com/QutEcoacoustics/baw-server/issues/449
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
