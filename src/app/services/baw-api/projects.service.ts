import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import {
  Description,
  ID,
  ImageURL,
  Name
} from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon } from "./api-common";
import { Filters } from "./base-api.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends ApiCommon<Project> {
  private paths: {
    [key: string]: string;
  };

  constructor(http: HttpClient, config: AppConfigService, router: Router) {
    super(http, config, router, Project);

    this.paths = {
      details: "/projects",
      show: "/projects/:projectId",
      new: "/projects",
      update: "/projects/:projectId"
    };
  }

  /**
   * Get a project available to the user
   * @param projectId Project ID
   * @param filters API filters
   * @returns Observable returning singular project
   */
  public getProject(projectId: ID, filters?: Filters): Subject<Project> {
    return this.show(this.paths.show, filters, projectId);
  }

  /**
   * Get list of projects available to the user
   * @param filters API filters
   * @returns Observable list of projects
   */
  public getProjects(filters?: Filters): Subject<Project[]> {
    return this.list(this.paths.details, filters);
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
    return this.new(this.paths.new, details);
  }

  /**
   * Update a project
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
    return this.update(this.paths.update, details, projectId);
  }
}
