import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { audioRecordingsMenuItem } from "@components/audio-recordings/audio-recording.menus";
import { projectMenuItem } from "@components/projects/projects.menus";
import { siteAnnotationsModal } from "@components/sites/sites.modals";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
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
  audioRecordingsMenuItem,
];

const projectKey = "project";
const siteKey = "site";

/**
 * Site Details Component
 */
@Component({
  selector: "baw-site-details",
  template: `
    <baw-site
      *ngIf="project && site"
      [project]="project"
      [site]="site"
    ></baw-site>
  `,
})
class SiteDetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public site: Site;

  public constructor(protected route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);

    if (!hasResolvedSuccessfully(models)) {
      return;
    }

    this.project = models[projectKey] as Project;
    this.site = models[siteKey] as Site;
  }
}

SiteDetailsComponent.linkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List([projectMenuItem, ...siteMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(siteMenuItem);

export { SiteDetailsComponent };
