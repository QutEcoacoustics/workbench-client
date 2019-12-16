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
import { APIErrorDetails } from "./api.interceptor";
import { BawApiService, Filters } from "./base-api.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends BawApiService {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config);

    this.paths = {
      details: "/projects",
      show: "/projects/:projectId",
      filter: "/projects/filter",
      new: "/projects",
      update: "/projects/:projectId"
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
    name: Name;
    description?: Description;
    image?: ImageURL;
  }): Subject<boolean> {
    const subject = new Subject<boolean>();

    const next = () => {
      subject.next(true);
      subject.complete();
    };
    const error = (err: APIErrorDetails) => subject.error(err);

    this.create(next, error, this.paths.new, {}, details, {});

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

    const next = () => {
      subject.next(true);
      subject.complete();
    };
    const error = (err: APIErrorDetails) => {
      // Deal with custom info
      if (err.info && err.info.name && err.info.name.length === 1) {
        subject.error(err.message + ": name " + err.info.name[0]);
      } else {
        subject.error(err.message);
      }
    };

    this.update(
      next,
      error,
      this.paths.update,
      { args: { projectId: id } },
      details,
      {}
    );

    return subject;
  }
}

export interface ProjectFilters extends Filters {
  orderBy?: "id" | "name" | "description" | "creatorId";
}
