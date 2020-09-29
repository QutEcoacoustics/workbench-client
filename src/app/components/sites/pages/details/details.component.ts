import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import { regionMenuItem } from "@components/regions/regions.menus";
import { PermissionsShieldComponent } from "@components/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@components/shared/widget/widgetItem";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import {
  deletePointMenuItem,
  editPointMenuItem,
  pointAnnotationsMenuItem,
  pointHarvestMenuItem,
  pointMenuItem,
  pointsCategory,
} from "../../points.menus";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  siteAnnotationsMenuItem,
  siteHarvestMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";

export const siteMenuItemActions = [
  exploreAudioMenuItem,
  siteAnnotationsMenuItem,
  editSiteMenuItem,
  siteHarvestMenuItem,
  deleteSiteMenuItem,
];
export const pointMenuItemActions = [
  exploreAudioMenuItem,
  pointAnnotationsMenuItem,
  editPointMenuItem,
  pointHarvestMenuItem,
  deletePointMenuItem,
];

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * Site Details Component
 */
@Component({
  selector: "app-site-details",
  template: `<app-site
    *ngIf="project && site"
    [project]="project"
    [site]="site"
  ></app-site>`,
})
class SiteDetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public site: Site;

  constructor(protected route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);

    if (!resolvedModels) {
      return;
    }

    this.project = resolvedModels[projectKey] as Project;
    this.site = resolvedModels[siteKey] as Site;
  }
}

@Component({
  selector: "app-point-details",
  template: `
    <app-site
      *ngIf="project && region && site"
      [project]="project"
      [region]="region"
      [site]="site"
    ></app-site>
  `,
})
class PointDetailsComponent extends SiteDetailsComponent implements OnInit {
  public region: Region;

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);

    if (!resolvedModels) {
      return;
    }

    this.project = resolvedModels[projectKey] as Project;
    this.region = resolvedModels[regionKey] as Region;
    this.site = resolvedModels[siteKey] as Site;
  }
}

SiteDetailsComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([projectMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(siteMenuItem);

PointDetailsComponent.LinkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([regionMenuItem, ...pointMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(pointMenuItem);

export { SiteDetailsComponent, PointDetailsComponent };
