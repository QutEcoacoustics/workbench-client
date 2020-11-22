import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { API_ROOT } from '@helpers/app-initializer/app-initializer';
import { stringTemplate } from '@helpers/stringTemplate/stringTemplate';
import { IProject, Project } from '@models/Project';
import type { User } from '@models/User';
import { Observable } from 'rxjs';
import {
  Empty,
  Filter,
  filterByForeignKey,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi,
} from '../api-common';
import { Filters } from '../baw-api.service';
import { Resolvers } from '../resolver-common';

const projectId: IdParamOptional<Project> = id;
const endpoint = stringTemplate`/projects/${projectId}${option}`;

/**
 * Projects Service.
 * Handles API routes pertaining to projects.
 */
@Injectable()
export class ProjectsService extends StandardApi<Project> {
  constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    injector: Injector
  ) {
    super(http, apiRoot, Project, injector);
  }

  public list(): Observable<Project[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  public filter(filters: Filters<IProject>): Observable<Project[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  public filterByCreator(
    filters: Filters<IProject>,
    user?: IdOr<User>
  ): Observable<Project[]> {
    return this.apiFilter(
      endpoint(Empty, Filter),
      user ? filterByForeignKey<Project>(filters, 'creatorId', user) : filters
    );
  }
  public show(model: IdOr<Project>): Observable<Project> {
    return this.apiShow(endpoint(model, Empty));
  }
  public create(model: Project): Observable<Project> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  public update(model: Project): Observable<Project> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  public destroy(model: IdOr<Project>): Observable<Project | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}

export const projectResolvers = new Resolvers<Project, ProjectsService>(
  [ProjectsService],
  'projectId'
).create('Project');
