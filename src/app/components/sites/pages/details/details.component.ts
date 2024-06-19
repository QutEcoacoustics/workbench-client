import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { siteResolvers, SitesService } from "@baw-api/site/sites.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  editPointMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { deletePointModal, pointAnnotationsModal } from "@components/sites/points.modals";
import { deleteSiteModal, siteAnnotationsModal } from "@components/sites/sites.modals";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs";
import { ConfigService } from "@services/config/config.service";
import { shallowRegionsRoute } from "@components/regions/regions.routes";
import { reportMenuItems } from "@components/reports/reports.menu";
import { verificationMenuItems } from "@components/verification/verification.menu";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";

export const siteMenuItemActions = [
  deleteSiteModal,
  visualizeMenuItem,
  siteAnnotationsModal,
  editSiteMenuItem,
  audioRecordingMenuItems.list.site,
  audioRecordingMenuItems.batch.site,
  reportMenuItems.new.site,
  verificationMenuItems.new.site,
];

export const pointMenuItemActions = [
  deletePointModal,
  visualizeMenuItem,
  pointAnnotationsModal,
  editPointMenuItem,
  audioRecordingMenuItems.list.siteAndRegion,
  audioRecordingMenuItems.batch.siteAndRegion,
  reportMenuItems.new.siteAndRegion,
  verificationMenuItems.new.siteAndRegion,
];

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * Site Details Component
 */
@Component({
  selector: "baw-site-details",
  template: `
    <baw-site
      *ngIf="!failure"
      [project]="project"
      [region]="region"
      [site]="site"
    ></baw-site>
  `,
})
class SiteDetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public region?: Region;
  public site: Site;
  public failure: boolean;

  public constructor(
    protected route: ActivatedRoute,
    private sitesApi: SitesService,
    private router: Router,
    private notifications: ToastrService,
    private config: ConfigService,
  ) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
  }

  public deleteModel(): void {
    this.sitesApi.destroy(this.site, this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(defaultSuccessMsg("destroyed", this.site?.name));

          // points have a parent region. Therefore, if the site is a point, navigate to the region details page
          // if the site is not a point, the parent item is conditional on if projects are hidden
          // if projects are hidden, navigate to the sites list page, if projects are shown, navigate to the parent project details page
          if (this.site.isPoint) {
            this.router.navigateByUrl(this.region.viewUrl);
          } else {
            const hideProjects = this.config.settings.hideProjects;
            this.router.navigateByUrl(hideProjects ? shallowRegionsRoute.toRouterLink() : this.project.viewUrl);
          }
        }
      });
  }
}

SiteDetailsComponent.linkToRoute({
  category: sitesCategory,
  pageRoute: siteMenuItem,
  menus: {
    actions: List(siteMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).linkToRoute({
  category: pointsCategory,
  pageRoute: pointMenuItem,
  menus: {
    actions: List(pointMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
});

export { SiteDetailsComponent };
