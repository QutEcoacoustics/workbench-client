import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import {
  deleteRegionMenuItem,
  editRegionMenuItem,
  regionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import { newPointMenuItem } from "@components/sites/points.menus";
import { PageInfo } from "@helpers/page/pageInfo";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";

export const regionMenuItemActions = [
  newPointMenuItem,
  editRegionMenuItem,
  deleteRegionMenuItem,
];

const projectKey = "project";
const regionKey = "region";

/**
 * Region Details Component
 */
@Component({
  selector: "baw-region",
  styleUrls: ["./details.component.scss"],
  template: `
    <ng-container *ngIf="region">
      <!-- Region Details -->
      <h1>
        <small class="text-muted"> Project: {{ project.name }} </small>
        <br />
        {{ region.name }}
      </h1>

      <p
        id="region_description"
        [innerHtml]="region.descriptionHtml || defaultDescription"
      ></p>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Points"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <baw-loading *ngIf="loading"></baw-loading>

      <p *ngIf="!hasSites() && !loading" class="lead">
        No additional data to display here, try adding points to the site
      </p>

      <div id="model-grid">
        <!-- Google Maps -->
        <div *ngIf="hasSites()" class="item map">
          <baw-site-map [project]="project" [region]="region"></baw-site-map>
        </div>

        <!-- Sites -->
        <div *ngFor="let site of sites" class="item">
          <baw-site-card [project]="project" [site]="site"></baw-site-card>
        </div>
      </div>

      <ngb-pagination
        *ngIf="displayPagination"
        aria-label="Pagination Buttons"
        class="mt-2 d-flex justify-content-end"
        [collectionSize]="collectionSize"
        [(page)]="page"
      ></ngb-pagination>
    </ng-container>
  `,
})
class DetailsComponent extends PaginationTemplate<Site> implements OnInit {
  public defaultDescription = "<i>No description found</i>";
  public project: Project;
  public region: Region;
  public sites: List<Site> = List([]);

  constructor(
    router: Router,
    route: ActivatedRoute,
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
      () => ({ regionId: { eq: this.region.id } })
    );
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (!models) {
      return;
    }
    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    super.ngOnInit();
  }

  public hasSites() {
    return this.sites.size > 0;
  }
}

DetailsComponent.LinkComponentToPageInfo({
  category: regionsCategory,
  menus: {
    actions: List([projectMenuItem, ...regionMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).AndMenuRoute(regionMenuItem);

export { DetailsComponent };
