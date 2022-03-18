import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  deletePointMenuItem,
  editPointMenuItem,
  pointHarvestMenuItem,
  pointMenuItem,
  pointsCategory,
} from "@components/sites/points.menus";
import { pointAnnotationsModal } from "@components/sites/points.modals";
import { siteAnnotationsModal } from "@components/sites/sites.modals";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  siteHarvestMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";

export const siteMenuItemActions = [
  visualizeMenuItem,
  siteAnnotationsModal,
  editSiteMenuItem,
  siteHarvestMenuItem,
  deleteSiteMenuItem,
  audioRecordingMenuItems.list.site,
  audioRecordingMenuItems.batch.site,
];

export const pointMenuItemActions = [
  visualizeMenuItem,
  pointAnnotationsModal,
  editPointMenuItem,
  pointHarvestMenuItem,
  deletePointMenuItem,
  audioRecordingMenuItems.list.siteAndRegion,
  audioRecordingMenuItems.batch.siteAndRegion,
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

  public constructor(protected route: ActivatedRoute) {
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
