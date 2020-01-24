import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Site } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import { AbstractApi } from "./api-common";
import { Filters } from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends AbstractApi<Site> {
  constructor(http: HttpClient, config: AppConfigService) {
    const id = (x: ID) => x;
    super(
      http,
      config,
      stringTemplate`/projects/${id}/sites`,
      stringTemplate`/projects/${id}/sites/${id}`,
      Site
    );
  }

  list(projectId: ID) {
    return super.list(projectId);
  }

  filter(filters: Filters) {
    return super.filter(filters);
  }

  show(projectId: ID, siteId: ID) {
    return super.show(projectId, siteId);
  }

  new(values: any, projectId: ID) {
    return super.new(values, projectId);
  }

  update(values: any, projectId: ID, siteId: ID) {
    return super.update(values, projectId, siteId);
  }

  delete(projectId: ID, siteId: ID) {
    return super.delete(projectId, siteId);
  }
}
