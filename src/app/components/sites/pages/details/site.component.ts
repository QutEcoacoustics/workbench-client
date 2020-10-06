import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import { PermissionsShieldComponent } from "@components/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@components/shared/widget/widgetItem";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { List } from "immutable";
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

const projectKey = "project";
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

export { SiteDetailsComponent };
