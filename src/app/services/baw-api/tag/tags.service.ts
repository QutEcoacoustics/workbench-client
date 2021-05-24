import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, Injector, Type } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { ITag, Tag, TagType } from "@models/Tag";
import { User } from "@models/User";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
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
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
  Resolvers,
} from "../resolver-common";

const tagId: IdParamOptional<Tag> = id;
const endpoint = stringTemplate`/tags/${tagId}${option}`;

@Injectable()
export class TagsService extends StandardApi<Tag> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Tag, injector);
  }

  public list(): Observable<Tag[]> {
    return this.apiList(endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<ITag>): Observable<Tag[]> {
    return this.apiFilter(endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Tag>): Observable<Tag> {
    return this.apiShow(endpoint(model, emptyParam));
  }
  public create(model: Tag): Observable<Tag> {
    return this.apiCreate(endpoint(emptyParam, emptyParam), model);
  }
  // TODO https://github.com/QutEcoacoustics/baw-server/issues/449
  public update(model: Tag): Observable<Tag> {
    return this.apiUpdate(endpoint(model, emptyParam), model);
  }
  public destroy(model: IdOr<Tag>): Observable<Tag | void> {
    return this.apiDestroy(endpoint(model, emptyParam));
  }

  /**
   * Filter tags by creator
   *
   * @param filters Tag filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<ITag>,
    user: IdOr<User>
  ): Observable<Tag[]> {
    return this.filter(
      this.filterThroughAssociation(filters, "creatorId", user) as Filters
    );
  }

  /**
   * List type of tags
   * TODO Replace with reference to baw server
   */
  public tagTypes(): Observable<TagType[]> {
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
    const additionalProvider = new Resolvers<Tag, []>(
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
  [],
  TagsService,
  { tagTypes: string }
> {
  public constructor() {
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
