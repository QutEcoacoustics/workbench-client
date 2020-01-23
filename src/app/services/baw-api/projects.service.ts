import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import {
  Description,
  ID,
  ImageURL,
  Name
} from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon, CommonApiPaths } from "./api-common";
import { Filters } from "./base-api.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends ApiCommon<Project> {
  private paths: CommonApiPaths;

  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Project);

    this.paths = {
      details: stringTemplate`/projects`,
      show: stringTemplate`/projects/${this.id}`,
      new: stringTemplate`/projects`,
      update: stringTemplate`/projects/${this.id}`,
      delete: stringTemplate`/projects/${this.id}`
    };
  }

  /**
   * Get a project available to the user
   * @param projectId Project ID
   * @param filters API filters
   * @returns Observable returning singular project
   */
  public getProject(projectId: ID, filters?: Filters): Subject<Project> {
    return this.show(this.paths.show(projectId), filters);
  }

  /**
   * Get list of projects available to the user
   * @param filters API filters
   * @returns Observable list of projects
   */
  public getProjects(filters?: Filters): Subject<Project[]> {
    return this.list(this.paths.details(), filters);
  }

  /**
   * Create a new project
   * @param details Form details
   */
  public newProject(details: {
    name: Name;
    description?: Description;
    image?: ImageURL;
  }): Subject<Project> {
    return this.new(this.paths.new(), details);
  }

  /**
   * Update a project
   * @param projectId Project ID
   * @param details Form details
   */
  public updateProject(
    projectId: ID,
    details: {
      name?: Name;
      description?: Description;
      image?: ImageURL;
    }
  ): Subject<Project> {
    return this.update(this.paths.update(projectId), details);
  }

  /**
   * Delete a project
   * @param projectId Project ID
   */
  public deleteProject(projectId: ID): Subject<boolean> {
    return this.delete(this.paths.delete(projectId));
  }
}
