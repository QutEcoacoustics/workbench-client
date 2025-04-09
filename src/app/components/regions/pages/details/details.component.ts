import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers, RegionsService } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  editRegionMenuItem,
  regionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import { deleteRegionModal } from "@components/regions/regions.modals";
import { shallowRegionsRoute } from "@components/regions/regions.routes";
import { newPointMenuItem } from "@components/sites/points.menus";
import { reportMenuItems } from "@components/reports/reports.menu";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";

export const regionMenuItemActions = [
  deleteRegionModal,
  newPointMenuItem,
  visualizeMenuItem,
  editRegionMenuItem,
  audioRecordingMenuItems.list.region,
  audioRecordingMenuItems.batch.region,
  reportMenuItems.new.region,
  annotationMenuItems.search.region,
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
      <h1>{{ region.name }}</h1>

      <div class="row mb-3">
        <div class="col-sm-4">
          <img
            class="img-thumbnail mx-auto d-block "
            [src]="region.imageUrls"
            [alt]="region.name + ' image'"
          />
        </div>
        <div class="col-sm-8">
          <p
            id="region_description"
            [innerHtml]="region.descriptionHtml || defaultDescription"
          ></p>
        </div>
      </div>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Points"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <p *ngIf="!hasSites() && !loading" class="lead">
        No additional data to display here, try adding points to the site
      </p>

      <ul id="model-grid" class="list-group">
        <!-- Google Maps -->
        <div *ngIf="hasSites()" class="item map">
          <baw-site-map [project]="project" [region]="region"></baw-site-map>
        </div>

        <!-- Sites -->
        <div *ngFor="let site of sites" class="item">
          <baw-site-card [project]="project" [site]="site"></baw-site-card>
        </div>
      </ul>

      <ngb-pagination
        *ngIf="displayPagination"
        aria-label="Pagination Buttons"
        class="mt-2 d-flex justify-content-end"
        [collectionSize]="collectionSize"
        [(page)]="page"
      ></ngb-pagination>
    </ng-container>
  `,
  standalone: false
})
class DetailsComponent extends PaginationTemplate<Site> implements OnInit {
  public defaultDescription = "<i>No description found</i>";
  public project: Project;
  public region: Region;
  public sites: List<Site> = List([]);

  public constructor(
    router: Router,
    route: ActivatedRoute,
    config: NgbPaginationConfig,
    sitesApi: SitesService,
    private regionsApi: RegionsService,
    private notifications: ToastService,
    private clientConfig: ConfigService,
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
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    if (!hasResolvedSuccessfully(models)) {
      return;
    }
    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    super.ngOnInit();
  }

  public hasSites() {
    return this.sites.size > 0;
  }

  public deleteModel(): void {
    const hideProjects = this.clientConfig.settings.hideProjects;

    this.regionsApi.destroy(this.region, this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(defaultSuccessMsg("destroyed", this.region.name));
          const newRouteLocation = hideProjects ? shallowRegionsRoute.toRouterLink() : this.project.viewUrl;
          this.router.navigateByUrl(newRouteLocation);
        }
      });
  }
}

DetailsComponent.linkToRoute({
  category: regionsCategory,
  pageRoute: regionMenuItem,
  menus: {
    actions: List(regionMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { DetailsComponent };
