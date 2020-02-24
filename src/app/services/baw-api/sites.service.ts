import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
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
import { Filters, Meta } from "./baw-api.service";
import { ListResolver, ShowResolver } from "./resolver-common";

const projectId: IdParam<Project> = id;
const siteId: IdParamOptional<Site> = id;
const endpoint = stringTemplate`/projects/${projectId}/sites/${siteId}${option}`;
const endpointShallow = stringTemplate`/sites/${siteId}${option}`;

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
    return this.apiCreate(endpoint(project, Empty, Empty), model);
  }
  update(model: Site, project: IdOr<Project>): Observable<Site> {
    return this.apiUpdate(endpoint(project, model, Empty), model);
  }
  destroy(model: IdOr<Site>, project: IdOr<Project>): Observable<Site | void> {
    return this.apiDestroy(endpoint(project, model, Empty));
  }
}

@Injectable({
  providedIn: "root"
})
export class ShallowSitesService extends StandardApi<Site, []> {
  constructor(http: HttpClient, config: AppConfigService) {
    super(http, config, Site);
  }

  list(): Observable<Site[]> {
    const sites: Site[] = [];

    for (let i = 0; i < 25; i++) {
      const site = new Site({
        id: i,
        name: "PLACEHOLDER SITE",
        description: "PLACEHOLDER DESCRIPTION",
        creatorId: 1
      });

      sites.push(site);
    }

    return of(sites).pipe(delay(1000));
    // return this.apiList(endpointShallow(Empty, Empty));
  }
  filter(filters: Filters): Observable<Site[]> {
    const sites: Site[] = [];
    const meta: Meta = {
      status: 200,
      message: "OK",
      sorting: {
        orderBy: "name",
        direction: "asc"
      },
      paging: {
        page: filters?.paging?.page ? filters.paging.page : 1,
        items: filters?.paging?.items ? filters?.paging?.items : 25,
        total: filters?.paging?.total ? filters?.paging?.total : 100,
        maxPage: 4,
        current:
          "http://staging.ecosounds.org/sites?direction=asc&items=25&order_by=name&page=1",
        previous: null,
        next: null
      }
    };

    for (let i = 0; i < 25; i++) {
      const site = new Site({
        id: i + (meta.paging.page - 1) * 25,
        name: "PLACEHOLDER SITE",
        description: "PLACEHOLDER DESCRIPTION",
        creatorId: 1
      });

      site.addMetadata(meta);
      sites.push(site);
    }

    return of(sites).pipe(delay(1000));
    // return this.apiFilter(endpointShallow(Empty, Filter), filters);
  }
  show(model: IdOr<Site>): Observable<Site> {
    return this.apiShow(endpointShallow(model, Empty));
  }
  create(model: Site): Observable<Site> {
    return this.apiCreate(endpointShallow(Empty, Empty), model);
  }
  update(model: Site): Observable<Site> {
    return this.apiUpdate(endpointShallow(model, Empty), model);
  }
  destroy(model: IdOr<Site>): Observable<Site | void> {
    return this.apiDestroy(endpointShallow(model, Empty));
  }
}

@Injectable({
  providedIn: "root"
})
export class SitesResolver extends ListResolver<Site> {
  constructor(api: SitesService) {
    super(api, params => [parseInt(params.get("projectId"), 10)]);
  }
}

@Injectable({
  providedIn: "root"
})
export class SiteResolver extends ShowResolver<Site> {
  constructor(api: SitesService) {
    super(
      api,
      params => {
        return parseInt(params.get("siteId"), 10);
      },
      params => [parseInt(params.get("projectId"), 10)]
    );
  }
}
