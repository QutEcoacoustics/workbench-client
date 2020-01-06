import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { BawApiService } from "../base-api.service";

@Injectable({
  providedIn: "root"
})
export class MockProjectsService extends BawApiService {
  public getProject() {
    return new Subject();
  }

  public getProjects() {
    return new Subject();
  }

  public getFilteredProjects() {
    return new Subject();
  }

  public newProject() {
    return new Subject();
  }

  public updateProject() {
    return new Subject();
  }
}
