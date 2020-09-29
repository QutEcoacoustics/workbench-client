import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SitesService } from "@baw-api/site/sites.service";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { MapMarkerOption } from "@shared/map/map.component";
import { List } from "immutable";

@Component({
  selector: "app-site-cards",
  templateUrl: "./site-cards.component.html",
  styleUrls: ["./site-cards.component.scss"],
})
export class SiteCardsComponent extends PaginationTemplate<Site> {
  @Input() public project: Project;
  @Input() public region: Region;
  public markers: List<MapMarkerOption> = List([]);
  public sites: List<Site> = List([]);
  protected api: SitesService;

  constructor(
    route: ActivatedRoute,
    router: Router,
    config: NgbPaginationConfig,
    sitesApi: SitesService
  ) {
    super(
      router,
      route,
      config,
      sitesApi,
      "name",
      () => [this.project.id],
      (sites) => (this.sites = List(sites)),
      () => (this.region ? { regionId: { eq: this.region.id } } : {})
    );
  }
}
