import { Injectable } from "@angular/core";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "../projects.service";
import { ListResolver, ShowResolver } from "./resolver-common";

@Injectable({
  providedIn: "root"
})
export class ProjectsResolverService extends ListResolver<Project> {
  constructor(api: ProjectsService) {
    super(api, () => []);
  }
}

@Injectable({
  providedIn: "root"
})
export class ProjectResolverService extends ShowResolver<Project> {
  constructor(api: ProjectsService) {
    super(api, params => {
      return [parseInt(params.get("projectId"), 10)];
    });
  }
}
