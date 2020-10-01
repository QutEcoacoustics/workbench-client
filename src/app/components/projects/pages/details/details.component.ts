import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { RegionsService } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import { newRegionMenuItem } from "@components/regions/regions.menus";
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { merge } from "rxjs";
import { switchMap } from "rxjs/operators";

export const projectMenuItemActions = [
  exploreAudioMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  newRegionMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem,
];

const projectKey = "project";

@Component({
  selector: "app-project",
  template: `
    <ng-container *ngIf="project">
      <h1>{{ project.name }}</h1>
      <div class="row">
        <div class="col-sm-4">
          <div class="thumbnail">
            <img [src]="project.image" [alt]="project.name + ' image'" />
          </div>
        </div>
        <div class="col-sm-8">
          <p
            id="project_description"
            [innerHTML]="project.descriptionHtml || defaultDescription"
          ></p>
        </div>
      </div>

      <p class="lead" *ngIf="!hasSites && !hasRegions">
        No additional data to display here, try adding sites to the project
      </p>

      <h2>
        Sites
        <small class="text-muted">
          found {{ collectionSizes.sites || 0 }} sites
        </small>
      </h2>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Sites"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <baw-loading [display]="loading"></baw-loading>

      <app-region-cards
        *ngIf="hasRegions && !loading"
        [project]="project"
        [regions]="regions"
      ></app-region-cards>
      <app-site-cards
        *ngIf="hasSites && !loading"
        [project]="project"
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
  styleUrls: ["./details.component.scss"],
})
class DetailsComponent extends PaginationTemplate<any> implements OnInit {
  public project: Project;
  public regions: List<Region>;
  public sites: List<Site>;

  public collectionSize = 0;
  public collectionSizes = { sites: 0, regions: 0 };
  public defaultDescription = "<i>No description found</i>";
  public hasRegions: boolean;
  public hasSites: boolean;
  public apiReturnCount = 0;

  constructor(
    route: ActivatedRoute,
    router: Router,
    config: NgbPaginationConfig,
    private regionsApi: RegionsService,
    private sitesApi: SitesService
  ) {
    super(
      router,
      route,
      config,
      undefined,
      "name",
      () => [this.project.id],
      (models) => {
        this.apiReturnCount++;
        this.loading = this.apiReturnCount !== 2;
        console.log(this.loading);

        if (models.length === 0) {
          return;
        }

        const collectionSize = models[0].getMetadata().paging.total || 0;

        if (models[0] instanceof Site) {
          this.sites = List(models);
          this.collectionSizes.sites = collectionSize;
        } else {
          this.regions = List(models);
          this.collectionSizes.regions = collectionSize;
        }

        this.collectionSize = Math.max(
          this.collectionSizes.sites,
          this.collectionSizes.regions
        );
      }
    );
  }

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    if (!resolvedModels) {
      return;
    }
    this.project = resolvedModels[projectKey] as Project;
    this.hasRegions = this.project.regionIds.size > 0;
    this.hasSites = this.project.siteIds.size > 0;

    super.ngOnInit();
  }

  protected getModels(): any {
    this.sites = List([]);
    this.regions = List([]);
    this.collectionSizes = { sites: 0, regions: 0 };
    this.apiReturnCount = 0;
    return merge(
      this.regionsApi.filter(this.generateFilter() as Filters, this.project.id),
      this.sitesApi.filter(this.generateFilter() as Filters, this.project.id)
    );
  }
}

DetailsComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectsMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(projectMenuItem);

export { DetailsComponent };
