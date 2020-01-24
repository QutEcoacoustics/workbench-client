import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { ID } from "src/app/interfaces/apiInterfaces";
import { Site } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import { AbstractApi } from "./api-common";

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
}
