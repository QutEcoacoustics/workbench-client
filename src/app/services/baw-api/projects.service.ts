import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Project, ProjectInterface } from "src/app/models/Project";
import {
  BawApiService,
  ErrorResponse,
  Filter,
  MetaError,
  Paths,
  ResponseList
} from "./base-api.service";
import { SecurityService } from "./security.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends BawApiService {
  protected paths: Paths;

  constructor(http: HttpClient, private security: SecurityService) {
    super(http);

    this.paths = {
      list: "/projects",
      show: "/projects/{projectId}",
      filter: "/projects/filter"
    };
  }

  /**
   * Get a project available to the user
   * @param id Project ID
   * @returns Observable returning singular project
   */
  getProject(id: number): Subject<Project> {
    const subject = new Subject<Project>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<ProjectResponse>(this.paths.show, {
        args: { projectId: id }
      }).subscribe(
        (data: ProjectResponse) => {
          subject.next(new Project(data.data));
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  getProjects(): Subject<Project[]> {
    const subject = new Subject<Project[]>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<ProjectsResponse>(this.paths.list).subscribe(
        (data: ProjectsResponse) => {
          subject.next(
            data.data.map(projectData => {
              return new Project(projectData);
            })
          );
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }

  /**
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  getFilteredProjects(filters: ProjectFilter): Subject<Project[]> {
    const subject = new Subject<Project[]>();

    this.security.getLoggedInTrigger().subscribe(() => {
      this.get<ProjectsResponse>(this.paths.filter, {
        filters
      }).subscribe(
        (data: ProjectsResponse) => {
          subject.next(
            data.data.map(projectData => {
              return new Project(projectData);
            })
          );
        },
        (err: ErrorResponse) => {
          subject.error(err);
        }
      );
    });

    return subject;
  }
}

export interface ProjectFilter extends Filter {
  orderBy?: "id" | "name" | "description" | "creatorId";
}

/**
 * Project interface
 */
export interface ProjectResponse extends Response {
  data: ProjectInterface;
}

/**
 * Projects interface
 */
export interface ProjectsResponse extends ResponseList {
  data: ProjectInterface[];
}
