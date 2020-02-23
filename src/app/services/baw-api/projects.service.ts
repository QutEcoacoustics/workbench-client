import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_ROOT } from "src/app/helpers/app-initializer/app-initializer";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Project } from "src/app/models/Project";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParamOptional,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./baw-api.service";

const projectId: IdParamOptional<Project> = id;
const endpoint = stringTemplate`/projects/${projectId}${option}`;

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends StandardApi<Project, []> {
  constructor(http: HttpClient, @Inject(API_ROOT) apiRoot: string) {
    super(http, apiRoot, Project);
  }

  list(): Observable<Project[]> {
    return this.apiList(endpoint(Empty, Empty));
  }
  filter(filters: Filters): Observable<Project[]> {
    return this.apiFilter(endpoint(Empty, Filter), filters);
  }
  show(model: IdOr<Project>): Observable<Project> {
    return this.apiShow(endpoint(model, Empty));
  }
  create(model: Project): Observable<Project> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(model: Project): Observable<Project> {
    return this.apiUpdate(endpoint(model, Empty), model);
  }
  destroy(model: IdOr<Project>): Observable<Project | void> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}
