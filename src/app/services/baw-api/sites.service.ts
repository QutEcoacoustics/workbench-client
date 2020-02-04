import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import {
  Empty,
  Filter,
  id,
  IdOr,
  IdParam,
  IdParamOptional,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./base-api.service";

const projectId: IdParam<Project> = id;
const siteId: IdParamOptional<Site> = id;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;

@Injectable({
  providedIn: "root"
})
export class SitesService extends StandardApi<Site, [IdOr<Project>]> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Site);
  }

  list(project: IdOr<Project>): Observable<Site[]> {
    return this.apiList(endpoint(project, Empty, Empty));
  }
  filter(filters: Filters, project: IdOr<Project>): Observable<Site[]> {
    return this.apiFilter(endpoint(project, Empty, Filter), filters);
  }
  show(model: IdOr<Site>, project: IdOr<Project>): Observable<Site> {
    return this.apiShow(endpoint(project, model, Empty));
  }
  create(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiCreate(endpoint(project, model, Empty), model);
  }
  update(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiUpdate(endpoint(project, model, Empty), model);
  }
  destroy(model: IdOr<Site>, project: IdOr<Project>): Observable<null> {
    return this.apiDestroy(endpoint(project, model, Empty));
  }
}

const endpointShallow = stringTemplate`/sites/${siteId}${option}`;

@Injectable({
  providedIn: "root"
})
export class SitesServiceShallow extends StandardApi<Site, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Site);
  }

  list(): Observable<Site[]> {
    return this.apiList(endpointShallow(Empty, Empty));
  }
  filter(filters: Filters): Observable<Site[]> {
    return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  show(model: IdOr<Site>): Observable<Site> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  create(model: Site): Observable<Site> {
    return this.apiCreate(endpointShallow(model, Empty), model);
  }
  update(model: Site): Observable<Site> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  destroy(model: IdOr<Site>): Observable<null> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}
