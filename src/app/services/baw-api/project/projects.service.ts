import { Injectable, Type } from "@angular/core";
import { Resolve } from "@angular/router";
import { Tuple } from "@helpers/advancedTypes";
import { stringTemplate } from "@helpers/stringTemplate/stringTemplate";
import { Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { IProject, Project } from "@models/Project";
import type { User } from "@models/User";
import { map, Observable } from "rxjs";
import {
  ApiFilter,
  ApiList,
  ApiShow,
  emptyParam,
  filterParam,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from "../api-common";
import { BawApiService, Filters } from "../baw-api.service";
import { BawResolver, ListResolver, ResolvedModel, Resolvers } from "../resolver-common";

const projectId: IdParamOptional<Project> = id;
const endpoint = stringTemplate`/projects/${projectId}${option}`;

/**
 * Projects Service.
 * Handles API routes pertaining to projects.
 */
@Injectable()
export class ProjectsService implements StandardApi<Project> {
  public constructor(private api: BawApiService<Project>) {}

  public list(): Observable<Project[]> {
    return this.api.list(Project, endpoint(emptyParam, emptyParam));
  }
  public filter(filters: Filters<Project>): Observable<Project[]> {
    return this.api.filter(Project, endpoint(emptyParam, filterParam), filters);
  }
  public show(model: IdOr<Project>): Observable<Project> {
    return this.api.show(Project, endpoint(model, emptyParam));
  }
  public create(model: Project): Observable<Project> {
    return this.api.create(
      Project,
      endpoint(emptyParam, emptyParam),
      (project) => endpoint(project, emptyParam),
      model
    );
  }
  public update(model: Project): Observable<Project> {
    return this.api.update(Project, endpoint(model, emptyParam), model);
  }
  public destroy(model: IdOr<Project>): Observable<Project | void> {
    return this.api.destroy(endpoint(model, emptyParam));
  }

  /**
   * Filter projects by creator
   *
   * @param filters Project filters
   * @param user user to filter by
   */
  public filterByCreator(
    filters: Filters<IProject>,
    user: IdOr<User>
  ): Observable<Project[]> {
    return this.filter(
      this.api.filterThroughAssociation(filters, "creatorId", user)
    );
  }
}

export const projectResolvers = new Resolvers<Project, []>(
  [ProjectsService],
  "projectId"
).create("Project");


export class ShowDefaultResolver<
  Model extends AbstractModel,
  Params extends any[],
  Service extends ApiFilter<Model, Params> = ApiFilter<
    Model,
    Params
  >
> extends BawResolver<Model, Model, Params, Service, { show: string }> {
  public constructor(
    deps: Type<Service>[],
    uniqueId?: string,
    params?: Tuple<string, Params["length"]>
  ) {
    super(deps, uniqueId, params);
  }

  public createProviders(
    name: string,
    resolver: Type<Resolve<ResolvedModel<Model>>>,
    deps: Type<Service>[]
  ) {
    return {
      show: name + "DefaultShowResolver",
      providers: [{ provide: name + "DefaultShowResolver", useClass: resolver, deps }],
    };
  }

  public create(name: string, required: true = true) {
    return super.create(name, required);
  }

  public resolverFn(_: any, api: Service, __: Id, ids: Params) {
    const filters = { paging: { items: 1 } } as Filters<Model>
    return api.filter(filters, ...ids).pipe(map((data) => data[0]));
  }
}

export const defaultProjectResolver = new ShowDefaultResolver<Project, [], ProjectsService>(
  [ProjectsService],
  null
).create("Project");
