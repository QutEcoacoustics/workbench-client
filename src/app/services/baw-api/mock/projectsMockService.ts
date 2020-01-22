import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Project } from "src/app/models/Project";
import { MockApiCommon } from "./api-commonMock";

@Injectable({
  providedIn: "root"
})
export class MockProjectsService extends MockApiCommon<Project> {
  public getProject() {
    return new Subject();
  }

  public getProjects() {
    return new Subject();
  }

  public newProject() {
    return new Subject();
  }

  public updateProject() {
    return new Subject();
  }

  public deleteProject() {
    return new Subject();
  }
}
