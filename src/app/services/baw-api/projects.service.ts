import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "../app-config/app-config.service";
import { AbstractApi } from "./api-common";

/**
 * Interacts with projects route in baw api
 */
@Injectable({
  providedIn: "root"
})
export class ProjectsService extends AbstractApi<Project> {
  constructor(http: HttpClient, config: AppConfigService) {
    const id = (x: ID) => x;
    super(
      http,
      config,
      stringTemplate`/projects`,
      stringTemplate`/projects/${id}`,
      Project
    );
  }
}
