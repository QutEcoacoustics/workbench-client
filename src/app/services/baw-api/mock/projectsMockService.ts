import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { ProjectFilters } from "../projects.service";
import { SecurityService } from "../security.service";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class MockProjectsService extends SecurityService {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get a project available to the user
   * @param id Project ID
   * @returns Observable returning singular project
   */
  public getProject(id: ID): Subject<Project> {
    const subject = new Subject<Project>();

    setTimeout(() => {
      subject.next(
        new Project({
          id,
          name: "Project",
          description: "A sample project",
          creatorId: 1,
          siteIds: new Set([1, 2, 3])
        })
      );
    }, 50);

    return subject;
  }

  /**
   * Get list of projects available to the user
   * @returns Observable list of projects
   */
  public getProjects(): Subject<Project[]> {
    const subject = new Subject<Project[]>();

    setTimeout(() => {
      subject.next([
        new Project({
          id: 1,
          name: "Project 1",
          description: "A sample project 1",
          creatorId: 1,
          siteIds: new Set([1, 2, 3])
        }),
        new Project({
          id: 2,
          name: "Project 2",
          description: "A sample project 2",
          creatorId: 2,
          siteIds: new Set([4, 5, 6])
        })
      ]);
    }, 50);

    return subject;
  }

  /**
   * Get list of filtered projects available to the user
   * @param filters Filters
   * @returns Observable list of projects
   */
  public getFilteredProjects(filters: ProjectFilters): Subject<Project[]> {
    const subject = new Subject<Project[]>();

    setTimeout(() => {
      subject.next([
        new Project({
          id: 1,
          name: "Project 1",
          description: "A sample project 1",
          creatorId: 1,
          siteIds: new Set([1, 2, 3])
        }),
        new Project({
          id: 2,
          name: "Project 2",
          description: "A sample project 2",
          creatorId: 2,
          siteIds: new Set([4, 5, 6])
        })
      ]);
    }, 50);

    return subject;
  }
}
