import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Project, ProjectInterface } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import { StandardApi } from "./api-common";
import { Filters } from "./base-api.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends StandardApi<Project> {
  constructor(http: HttpClient, config: AppConfigService) {
    const id = (x: ID) => x;
    super(
      http,
      config,
      stringTemplate`/projects`,
      stringTemplate`/projects/${id}`,
      Project
    );
  }

  public list: () => Subject<Project[]>;
  public filter: (filters: Filters) => Subject<Project[]>;
  public show: (projectId: ID) => Subject<Project>;
  public new: (values: ProjectInterface) => Subject<Project>;
  public update: (values: ProjectInterface, projectId: ID) => Subject<Project>;
  public delete: (projectId: ID) => Subject<boolean>;
}
