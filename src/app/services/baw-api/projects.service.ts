import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
  Description,
  ID,
  ImageURL,
  Name
} from "src/app/interfaces/apiInterfaces";
import { Project, ProjectInterface } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import { Filters } from "./base-api.service";
import { ModelService } from "./model.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends ModelService<Project> {
  private paths: {
    [key: string]: string;
  };

  constructor(http: HttpClient, config: AppConfigService) {
    const classBuilder = (project: ProjectInterface) => new Project(project);
    super(http, config, classBuilder);

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
   * @returns Observable returning singular project
   */
  public getProject(projectId: ID): Subject<Project> {
    return this.modelShow(this.paths.show, projectId);
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  public getProjects(): Subject<Project[]> {
    return this.modelDetails(this.paths.details);
  }

  /**
   * TODO Fix this
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  public getFilteredProjects(filters: ProjectFilters): Subject<Project[]> {
    return this.getProjects();
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
    return this.modelNew(this.paths.new, details);
  }

  /**
   * Update a project
   * @param details Form details
   */
  public updateProject(
    projectId: ID,
    details: {
      name: Name;
      description?: Description;
      image?: ImageURL;
    }
  ): Subject<Project> {
    return this.modelUpdate(this.paths.update, details, projectId);
  }
}

export interface ProjectFilters extends Filters {
  orderBy?: "id" | "name" | "description" | "creatorId";
}
