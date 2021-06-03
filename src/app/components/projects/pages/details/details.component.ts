import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { PageInfo } from "@helpers/page/pageInfo";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { merge } from "rxjs";

export const projectMenuItemActions = [
  visualizeMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem,
];

const projectKey = "project";

@Component({
  selector: "baw-project",
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

      <h2>
        Sites
        <small class="text-muted">
          <!-- TODO This calculation is inaccurate -->
          found {{ collectionSizes.sites + collectionSizes.regions }} sites
        </small>
      </h2>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Sites"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <baw-loading *ngIf="loading"></baw-loading>

      <p *ngIf="!hasSites && !hasRegions && !loading" class="lead">
        No additional data to display here, try adding sites to the project
      </p>

      <div id="model-grid">
        <!-- Google Maps -->
        <div *ngIf="hasSites || hasRegions || loading" class="item map">
          <baw-site-map [project]="project"></baw-site-map>
        </div>

        <!-- Regions -->
        <div *ngFor="let region of regions" class="item">
          <baw-site-card [project]="project" [region]="region"></baw-site-card>
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
  styleUrls: ["./details.component.scss"],
})
class DetailsComponent extends PaginationTemplate<any> implements OnInit {
  public collectionSize = 0;
  public collectionSizes = { sites: 0, regions: 0 };
  public defaultDescription = "<i>No description found</i>";
  public hasRegions: boolean;
  public hasSites: boolean;
  public project: Project;
  public regions: List<Region>;
  public sites: List<Site>;
  /**
   * Api requests are independent, use this to track when both complete
   */
  private apiReturnCount = 0;

  public constructor(
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

        if (models.length === 0) {
          return;
        }

        const collectionSize = models[0].getMetadata().paging.total || 0;

        if (models[0] instanceof Site) {
          this.sites = List(models);
          this.collectionSizes.sites = collectionSize;
          this.hasSites = true;
        } else {
          this.regions = List(models);
          this.collectionSizes.regions = collectionSize;
          this.hasRegions = true;
        }

        this.collectionSize = Math.max(
          this.collectionSizes.sites,
          this.collectionSizes.regions
        );
      }
    );
  }

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (!models) {
      return;
    }
    this.project = models[projectKey] as Project;
    super.ngOnInit();
  }

  protected getModels(): any {
    this.sites = List([]);
    this.regions = List([]);
    this.hasRegions = false;
    this.hasSites = false;
    this.collectionSizes = { sites: 0, regions: 0 };
    this.apiReturnCount = 0;

    return merge(
      this.regionsApi.filter(this.generateFilter() as Filters, this.project.id),
      this.sitesApi.filterByRegion(
        this.generateFilter() as Filters,
        this.project.id,
        null
      )
    );
  }
}

DetailsComponent.linkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectsMenuItem, ...projectMenuItemActions]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent)],
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).andMenuRoute(projectMenuItem);

export { DetailsComponent };
