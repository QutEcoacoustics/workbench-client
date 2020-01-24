import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Site, SiteInterface } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import { StandardApi } from "./api-common";
import { Filters } from "./base-api.service";

@Injectable({
  providedIn: "root"
})
export class SitesService extends StandardApi<Site> {
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

  public list: (projectId: ID) => Subject<Site[]>;
  public filter: (filters: Filters, projectId: ID) => Subject<Site[]>;
  public show: (projectId: ID, siteId: ID) => Subject<Site>;
  public new: (values: SiteInterface, projectId: ID) => Subject<Site>;
  public update: (
    values: SiteInterface,
    projectId: ID,
    siteId: ID
  ) => Subject<Site>;
  public delete: (projectId: ID, siteId: ID) => Subject<boolean>;
}
