import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "../../app-config/app-config.service";
import { StandardApi } from "../api-common";

@Injectable({
  providedIn: "root"
})
export class MockProjectsService extends StandardApi<Project, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Project);
  }

  public list() {
    return new Observable<Project[]>();
  }

  public filter() {
    return new Observable<Project[]>();
  }

  public show() {
    return new Observable<Project>();
  }

  public create() {
    return new Observable<Project>();
  }

  public update() {
    return new Observable<Project>();
  }

  public destroy() {
    return new Observable<Project | void>();
  }
}
