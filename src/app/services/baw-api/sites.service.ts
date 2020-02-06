import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { stringTemplate } from "src/app/helpers/stringTemplate/stringTemplate";
import { Project } from "src/app/models/Project";
import { Site, SiteInterface } from "src/app/models/Site";
import { AppConfigService } from "../app-config/app-config.service";
import {
  Empty,
  Filter,
  IdOr,
  IdParam,
  IdParamOptional,
  modelId,
  option,
  StandardApi
} from "./api-common";
import { Filters } from "./base-api.service";

const projectId: IdParam<Project> = modelId;
const siteId: IdParamOptional<Site> = modelId;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;

@Injectable({
  providedIn: "root"
})
export class SitesService extends StandardApi<
  Site,
  SiteInterface,
  [IdOr<Project>]
> {
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
  create(model: SiteInterface, project: IdOr<Project>): Observable<Site> {
    return this.apiCreate(endpoint(project, Empty, Empty), model);
  }
  update(
    id: IdOr<Site>,
    model: SiteInterface,
    project: IdOr<Project>
  ): Observable<Site> {
    return this.apiUpdate(endpoint(project, id, Empty), model);
  }
  destroy(model: IdOr<Site>, project: IdOr<Project>): Observable<null> {
    return this.apiDestroy(endpoint(project, model, Empty));
  }
}

const endpointShallow = stringTemplate`/sites/${siteId}${option}`;

@Injectable({
  providedIn: "root"
})
export class ShallowSitesService extends StandardApi<Site, SiteInterface, []> {
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
  create(model: SiteInterface): Observable<Site> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  update(id: IdOr<Site>, model: SiteInterface): Observable<Site> {
    return this.apiUpdate(endpointShallow(id, Empty), model);
  }
  destroy(model: IdOr<Site>): Observable<null> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}
