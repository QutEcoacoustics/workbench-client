import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Project, ProjectInterface } from "src/app/models/Project";
import { Filter, Paths } from "./base-api.service";
import { SecurityService } from "./security.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends SecurityService {
  protected paths: Paths;

  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      details: "/projects",
      show: "/projects/{projectId}",
      filter: "/projects/filter"
    };
  }

  /**
   * Get a project available to the user
   * @param id Project ID
   * @returns Observable returning singular project
   */
  public getProject(id: number): Subject<Project> {
    const subject = new Subject<Project>();
    const callback = (project: ProjectInterface) => new Project(project);

    this.getDetails(subject, callback, this.paths.show, {
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

    this.getDetails(subject, callback, this.paths.details);

    return subject;
  }

  /**
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  public getFilteredProjects(filters: ProjectFilter): Subject<Project[]> {
    const subject = new Subject<Project[]>();
    const callback = (projects: ProjectInterface[]) =>
      projects.map((project: ProjectInterface) => new Project(project));

    this.getDetails(subject, callback, this.paths.filter, {
      filters
    });

    return subject;
  }
}

interface ProjectFilter extends Filter {
  orderBy?: "id" | "name" | "description" | "creatorId";
}
