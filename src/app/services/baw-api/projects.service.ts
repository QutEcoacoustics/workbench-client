import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { BawApiService, Paths } from "./base-api.service";

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
   * Get list of projects available to user
   * @returns Observable list of projects
   */
  getProjectList(): Observable<Projects | string> {
    return this.http
      .get<Projects>(this.getPath(this.paths.projects.list), this.httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
}

/**
 * Projects interface
 */
interface Projects {
  meta: {
    status: number;
    message: string;
    error?: {
      details: string;
      info: string;
    };
    sorting?: {
      order_by: string;
      direction: string;
    };
    paging?: {
      page: number;
      items: number;
      total: number;
      max_page: number;
      current: string;
      previous: string;
      next: string;
    };
  };
  data: {
    id: number;
    name: string;
    description: string;
    creator_id: number;
    site_ids: number[];
    description_html: string;
  }[];
}
