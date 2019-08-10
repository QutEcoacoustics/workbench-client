import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { BawApiService, MetaError, Paths } from "./base-api.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends BawApiService {
  protected paths: Paths;

  constructor(http: HttpClient) {
    super(http);

    this.paths = {
      projects: {
        list: "/projects",
        show: "/projects/{projectId}",
        filter: "/projects/filter"
      }
    };
  }

  /**
   * Get a project available to the user
   * @param id Project ID
   */
  getProject(id: number): Observable<Project | string> {
    return this.http
      .get<Project>(
        this.getPath(this.paths.projects.show, { args: { projectId: id } }),
        this.getHeaderOptions()
      )
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  getList(): Observable<Projects | string> {
    return this.http
      .get<Projects>(
        this.getPath(this.paths.projects.list),
        this.getHeaderOptions()
      )
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getFilteredList(options: {
    direction?: "asc" | "desc";
    items?: number;
    orderBy?: "id" | "name" | "description" | "creator_id";
    page?: number;
  }): Observable<Projects | string> {
    const filters = {
      direction: options.direction,
      items: options.items,
      order_by: options.orderBy,
      page: options.page
    };

    return this.http
      .get<Projects>(
        this.getPath(this.paths.projects.list, { filters }),
        this.getHeaderOptions()
      )
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
}

/**
 * Project data interface
 */
export interface ProjectData {
  id: number;
  name: string;
  description: string;
  creator_id: number;
  site_ids: number[];
  description_html: string;
}

/**
 * Project interface
 */
export interface Project {
  meta: {
    status: string;
    message: string;
    error?: MetaError;
  };
  data: ProjectData;
}

/**
 * Projects interface
 */
export interface Projects {
  meta: {
    status: number;
    message: string;
    error?: MetaError;
    sorting: {
      order_by: string;
      direction: string;
    };
    paging: {
      page: number;
      items: number;
      total: number;
      max_page: number;
      current: string;
      previous: string;
      next: string;
    };
  };
  data: ProjectData[];
}
