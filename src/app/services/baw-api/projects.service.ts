import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  BawApiService,
  Filter,
  List,
  MetaError,
  Paths
} from "./base-api.service";

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
   * @returns Observable returning singular site
   */
  getProject(id: number): Observable<Project | string> {
    return this.get<Project>(this.paths.projects.show, {
      args: { projectId: id }
    });
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  getProjects(): Observable<Projects | string> {
    return this.get<Projects>(this.paths.projects.list);
  }

  /**
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  getFilteredProjects(filters: ProjectFiler): Observable<Projects | string> {
    return this.get<Projects>(this.paths.projects.list, { filters });
  }
}

export interface ProjectFiler extends Filter {
  orderBy?: "id" | "name" | "description" | "creatorId";
}

/**
 * Project data interface
 */
export interface ProjectData {
  creatorId: number;
  description: string;
  id: number;
  name: string;
  siteIds: number[];
}

/**
 * Project interface
 */
export interface Project {
  meta: {
    status: number;
    message: string;
    error?: MetaError;
  };
  data: ProjectData;
}

/**
 * Projects interface
 */
export interface Projects extends List {
  data: ProjectData[];
}
