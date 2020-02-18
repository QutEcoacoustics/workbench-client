import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Project } from "src/app/models/Project";
import { SitesService } from "../sites.service";
import { ListResolver, ShowResolver } from "./resolver-common";

@Injectable({
  providedIn: "root"
})
export class SitesResolverService extends ListResolver<Project> {
  constructor(api: SitesService, router: Router) {
    super(api, router, params => [parseInt(params.get("projectId"), 10)]);
  }
}

@Injectable({
  providedIn: "root"
})
export class SiteResolverService extends ShowResolver<Project> {
  constructor(api: SitesService, router: Router) {
    super(api, router, params => {
      return [
        parseInt(params.get("projectId"), 10),
        parseInt(params.get("siteId"), 10)
      ];
    });
  }
}
