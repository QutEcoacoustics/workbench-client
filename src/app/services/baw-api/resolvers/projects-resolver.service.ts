import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "../projects.service";
import { ListResolver, ShowResolver } from "./resolver-common";

@Injectable({
  providedIn: "root"
})
export class ProjectsResolverService extends ListResolver<Project> {
  constructor(api: ProjectsService, router: Router) {
    super(api, router, () => []);
  }
}

@Injectable({
  providedIn: "root"
})
export class ProjectResolverService extends ShowResolver<Project> {
  constructor(api: ProjectsService, router: Router) {
    super(api, router, params => {
      return [parseInt(params.get("projectId"), 10)];
    });
  }
}
