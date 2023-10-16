import { Injectable, Type } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Tag, TagType } from "@models/Tag";
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
import { BawApiService, Filters } from "../baw-api.service";
import {
  BawProvider,
  BawResolver,
  ResolvedModel,
  Resolvers,
} from "../resolver-common";

const tagId: IdParamOptional<Tag> = id;
const endpoint = stringTemplate`/tags/${tagId}${option}`;

@Injectable()
export class TagsService implements StandardApi<Tag> {
  public constructor(private api: BawApiService<Tag>) {}

  public list(): Observable<Tag[]> {
    return this.api.list(Tag, endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<Tag>): Observable<Tag[]> {
    return this.api.filter(Tag, endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Tag>): Observable<Tag> {
    return this.api.show(Tag, endpoint(model, emptyParam));
  }
  public create(model: Tag): Observable<Tag> {
    return this.api.create(
      Tag,
      endpoint(emptyParam, emptyParam),
      (tag) => endpoint(tag, emptyParam),
      model
    );
  }
  // TODO https://github.com/QutEcoacoustics/baw-server/issues/449
  public update(model: Tag): Observable<Tag> {
    return this.api.update(Tag, endpoint(model, emptyParam), model);
  }
  public destroy(model: IdOr<Tag>): Observable<Tag | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  /**
   * Filter tags by creator
   *
   * @param filters Tag filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<Tag>,
    user: IdOr<User>
  ): Observable<Tag[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "creatorId", user)
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
    resolver: Type<{
    resolve: ResolveFn<ResolvedModel<TagType[]>>;
}>,
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
