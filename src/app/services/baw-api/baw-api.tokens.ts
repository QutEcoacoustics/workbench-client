import { InjectionToken } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ProjectsService } from "./projects.service";
import { SitesService } from "./sites.service";

export const PROJECTS_TOKEN = new InjectionToken<Project[]>("ProjectsToken");
export const PROJECT_TOKEN = new InjectionToken<Project>("ProjectToken");
export const SITES_TOKEN = new InjectionToken<Site[]>("SitesToken");
export const SITE_TOKEN = new InjectionToken<Site>("SiteToken");

function projectFactory(
  api: ProjectsService,
  route: ActivatedRoute
): Observable<Project> {
  return api.show(getParams(route).projectId);
}

function projectsFactory(api: ProjectsService): Observable<Project[]> {
  return api.list();
}
function siteFactory(
  api: SitesService,
  route: ActivatedRoute
): Observable<Site> {
  const params = getParams(route);
  return api.show(params.projectId, params.siteId);
}

function sitesFactory(
  api: SitesService,
  route: ActivatedRoute
): Observable<Site[]> {
  return api.list(getParams(route).projectId);
}

function getParams(route: ActivatedRoute) {
  return route.snapshot.children[0].firstChild.params;
}

export const bawTokens = [
  {
    provide: PROJECT_TOKEN,
    useFactory: projectFactory,
    deps: [ProjectsService, ActivatedRoute]
  },
  {
    provide: PROJECTS_TOKEN,
    useFactory: projectsFactory,
    deps: [ProjectsService]
  },
  {
    provide: SITE_TOKEN,
    useFactory: siteFactory,
    deps: [SitesService, ActivatedRoute]
  },
  {
    provide: SITES_TOKEN,
    useFactory: sitesFactory,
    deps: [SitesService, ActivatedRoute]
  }
];
