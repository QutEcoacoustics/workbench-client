import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Project, ProjectInterface } from "src/app/models/Project";
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends BawApiService {
  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      details: "/projects",
      show: "/projects/:projectId",
      filter: "/projects/filter",
      new: "/projects"
    };
  }

  /**
   * Get a project available to the user
   * @param id Project ID
   * @returns Observable returning singular project
   */
  public getProject(id: ID): Subject<Project> {
    const subject = new Subject<Project>();
    const callback = (project: ProjectInterface) => new Project(project);

    this.details(subject, callback, this.paths.show, {
      args: { projectId: id }
    });

    return subject;
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  public getProjects(): Subject<Project[]> {
    const subject = new Subject<Project[]>();
    const callback = (projects: ProjectInterface[]) =>
      projects.map((project: ProjectInterface) => new Project(project));

    this.details(subject, callback, this.paths.details);

    return subject;
  }

  /**
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  public getFilteredProjects(filters: ProjectFilters): Subject<Project[]> {
    const subject = new Subject<Project[]>();
    const callback = (projects: ProjectInterface[]) =>
      projects.map((project: ProjectInterface) => new Project(project));

    this.details(subject, callback, this.paths.filter, {}, filters);

    return subject;
  }

  /**
   * Create a new project
   * @param details Form details
   */
  public newProject(details: {
    name: string;
    description: string;
    creatorId: string;
    image: string;
  }): Subject<boolean> {
    const subject = new Subject<boolean>();

    const next = (data: ProjectInterface) => {
      console.debug(data);
      subject.next(true);
    };
    const error = (err: APIErrorDetails) => {
      console.debug(err);
      subject.error(err.message);
    };

    this.create(next, error, this.paths.new, {}, details, {});

    return subject;
  }
}

export interface ProjectFilters extends Filters {
  orderBy?: "id" | "name" | "description" | "creatorId";
}
