import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { regionMenuItem } from "@components/regions/regions.menus";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { PageInfo } from "@helpers/page/pageInfo";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
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
import { SiteDetailsComponent } from "./site.component";

export const pointMenuItemActions = [
  visualizeMenuItem,
  pointAnnotationsMenuItem,
  editPointMenuItem,
  pointHarvestMenuItem,
  deletePointMenuItem,
];

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-point-details",
  template: `
    <baw-site
      *ngIf="project && region && site"
      [project]="project"
      [region]="region"
      [site]="site"
    ></baw-site>
  `,
})
class PointDetailsComponent extends SiteDetailsComponent implements OnInit {
  public region: Region;

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);

    if (!models) {
      return;
    }

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
  }
}

PointDetailsComponent.linkComponentToPageInfo({
  category: pointsCategory,
  menus: {
    actions: List([regionMenuItem, ...pointMenuItemActions]),
    actionWidgets: [new WidgetMenuItem(PermissionsShieldComponent)],
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).andMenuRoute(pointMenuItem);

export { PointDetailsComponent };
