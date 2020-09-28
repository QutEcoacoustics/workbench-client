import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RegionsService } from "@baw-api/region/regions.service";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";

@Component({
  selector: "app-region-cards",
  templateUrl: "./region-cards.component.html",
  styleUrls: ["./region-cards.component.scss"],
})
export class RegionCardsComponent extends PaginationTemplate<Region> {
  @Input() public project: Project;
  public regions: List<Region> = List([]);
  protected api: RegionsService;

  constructor(
    route: ActivatedRoute,
    router: Router,
    config: NgbPaginationConfig,
    regionsApi: RegionsService
  ) {
    super(
      router,
      route,
      config,
      regionsApi,
      "name",
      () => [this.project.id],
      (regions) => (this.regions = List(regions))
    );
  }

  public numSites(region: Region) {
    return region.siteIds?.size || 0;
  }
}
