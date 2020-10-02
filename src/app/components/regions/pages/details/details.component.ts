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
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
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
  selector: "app-region",
  template: `
    <ng-container *ngIf="region">
      <!-- Region Details -->
      <h1>
        <small class="text-muted"> Project: {{ project.name }} </small>
        <br />
        {{ region.name }}
      </h1>

      <p id="region_description" [innerHtml]="region.descriptionHtml"></p>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Points"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <baw-loading [display]="loading"></baw-loading>

      <app-site-cards
        [showMap]="true"
        [project]="project"
        [region]="region"
        [sites]="sites"
      ></app-site-cards>

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
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    if (!resolvedModels) {
      return;
    }
    this.project = resolvedModels[projectKey] as Project;
    this.region = resolvedModels[regionKey] as Region;
    super.ngOnInit();
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
