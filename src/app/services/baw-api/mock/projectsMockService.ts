import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Project } from "src/app/models/Project";
import { MockModelService } from "./modelMockService";

@Injectable({
  providedIn: "root"
})
export class MockProjectsService extends MockModelService<Project> {
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
