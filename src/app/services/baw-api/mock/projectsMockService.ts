import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import {
  Description,
  ID,
  ImageURL,
  Name
} from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "../../app-config/app-config.service";
import { BawApiService } from "../base-api.service";
import { ProjectFilters } from "../projects.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class MockProjectsService extends BawApiService {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);
  }

  /**
   * Get a project available to the user
   * @param id Project ID
   * @returns Observable returning singular project
   */
  public getProject(id: ID): Subject<Project> {
    const subject = new Subject<Project>();

    return subject;
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  public getProjects(): Subject<Project[]> {
    const subject = new Subject<Project[]>();

    return subject;
  }

  /**
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  public getFilteredProjects(filters: ProjectFilters): Subject<Project[]> {
    const subject = new Subject<Project[]>();

    return subject;
  }

  /**
   * Create a new project
   * @param details Form details
   */
  public newProject(details: {
    name: Name;
    description?: Description;
    image?: ImageURL;
  }): Subject<boolean> {
    const subject = new Subject<boolean>();

    return subject;
  }

  /**
   * Update a project
   * @param details Form details
   */
  public updateProject(
    id: ID,
    details: {
      name: Name;
      description?: Description;
      image?: ImageURL;
    }
  ): Subject<boolean> {
    const subject = new Subject<boolean>();

    return subject;
  }
}
