import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  regionResolvers,
  RegionsService,
} from "@baw-api/region/regions.service";
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
import { deleteRegionModal, regionAnnotationsModal } from "@components/regions/regions.modals";
import { shallowRegionsRoute } from "@components/regions/regions.routes";
import { newPointMenuItem } from "@components/sites/points.menus";
import { reportMenuItems } from "@components/reports/reports.menu";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { licenseWidgetMenuItem, permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { annotationMenuItems } from "@components/annotations/annotation.menu";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { SiteMapComponent } from "../../../projects/components/site-map/site-map.component";
import { SiteCardComponent } from "../../../projects/components/site-card/site-card.component";

export const regionMenuItemActions = [
  deleteRegionModal,
  newPointMenuItem,
  visualizeMenuItem,
  editRegionMenuItem,
  audioRecordingMenuItems.list.region,
  audioRecordingMenuItems.batch.region,
  reportMenuItems.new.region,
  annotationMenuItems.search.region,
  regionAnnotationsModal,
];

const projectKey = "project";
const regionKey = "region";

/**
 * Region Details Component
 */
@Component({
  selector: "baw-region",
  styleUrl: "./details.component.scss",
  template: `
    @if (region) {
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

      <label class="input-group mb-3">
        <span class="input-group-prepend input-group-text">Filter</span>
        <input
          bawDebouncedInput
          type="text"
          class="form-control"
          placeholder="Filter Points"
          [value]="filter"
          (valueChange)="onFilter($event)"
        >
      </label>

      @if (!hasSites() && !loading) {
        <p class="lead">
          No additional data to display here, try adding points to the site
        </p>
      }

      <ul id="model-grid" class="list-group">
        <!-- Google Maps -->
        @if (hasSites()) {
          <div class="item map">
            <baw-site-map [regions]="[region]"></baw-site-map>
          </div>
        }

        <!-- Sites -->
        @for (site of sites; track site) {
          <div class="item">
            <baw-site-card [project]="project" [site]="site"></baw-site-card>
          </div>
        }
      </ul>
      @if (displayPagination) {
        <ngb-pagination
          aria-label="Pagination Buttons"
          class="mt-2 d-flex justify-content-end"
          [collectionSize]="collectionSize"
          [(page)]="page"
        ></ngb-pagination>
      }
    }
  `,
  imports: [
      AuthenticatedImageDirective,
      DebouncedInputDirective,
      SiteMapComponent,
      SiteCardComponent,
      NgbPagination,
  ],
})
class RegionDetailsComponent extends PaginationTemplate<Site> implements OnInit {
  public defaultDescription = "<i>No description found</i>";
  public project: Project;
  public region: Region;
  public sites: List<Site> = List([]);

  public constructor(
    sitesApi: SitesService,
    private regionsApi: RegionsService,
    private notifications: ToastService,
    private clientConfig: ConfigService
  ) {
    super(
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

    this.regionsApi
      .destroy(this.region, this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(
            defaultSuccessMsg("destroyed", this.region.name)
          );
          const newRouteLocation = hideProjects
            ? shallowRegionsRoute.toRouterLink()
            : this.project.viewUrl;
          this.router.navigateByUrl(newRouteLocation);
        },
      });
  }
}

RegionDetailsComponent.linkToRoute({
  category: regionsCategory,
  pageRoute: regionMenuItem,
  menus: {
    actions: List(regionMenuItemActions),
    actionWidgets: List([
      permissionsWidgetMenuItem,
      licenseWidgetMenuItem,
    ]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
});

export { RegionDetailsComponent };
