import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Project, ProjectInterface } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import {
  Empty,
  Filter,
  IdOr,
  IdParamOptional,
  modelId,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./base-api.service";

const projectId: IdParamOptional<Project> = modelId;
const endpoint = stringTemplate`/projects/${projectId}${option}`;

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends StandardApi<
  Project,
  ProjectInterface,
  []
> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Project);
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
  create(model: ProjectInterface): Observable<Project> {
    return this.apiCreate(endpoint(Empty, Empty), model);
  }
  update(id: IdOr<Project>, model: ProjectInterface): Observable<Project> {
    return this.apiUpdate(endpoint(id, Empty), model);
  }
  destroy(model: IdOr<Project>): Observable<null> {
    return this.apiDestroy(endpoint(model, Empty));
  }
}
