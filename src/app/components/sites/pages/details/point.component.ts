import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { regionMenuItem } from "@components/regions/regions.menus";
import { PermissionsShieldComponent } from "@components/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@components/shared/widget/widgetItem";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
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
  exploreAudioMenuItem,
  pointAnnotationsMenuItem,
  editPointMenuItem,
  pointHarvestMenuItem,
  deletePointMenuItem,
];

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

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

export { PointDetailsComponent };
