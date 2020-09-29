import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { projectMenuItem } from "@components/projects/projects.menus";
import {
  deleteRegionMenuItem,
  editRegionMenuItem,
  regionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import { newPointMenuItem } from "@components/sites/points.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";

export const regionMenuItemActions = [
  newPointMenuItem,
  editRegionMenuItem,
  deleteRegionMenuItem,
];

const projectKey = "project";
const regionKey = "region";

/**
 * Region Details Component
 */
@Component({
  selector: "app-region",
  template: `
    <ng-container *ngIf="region">
      <!-- Region Details -->
      <h1>
        <small class="text-muted"> Project: {{ project.name }} </small>
        <br />
        {{ region.name }}
      </h1>

      <p id="region_description" [innerHtml]="region.descriptionHtml"></p>

      <app-site-cards [project]="project" [region]="region"></app-site-cards>
    </ng-container>
  `,
})
class DetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public region: Region;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    if (!resolvedModels) {
      return;
    }
    this.project = resolvedModels[projectKey] as Project;
    this.region = resolvedModels[regionKey] as Region;
  }
}

DetailsComponent.LinkComponentToPageInfo({
  category: regionsCategory,
  menus: {
    actions: List([projectMenuItem, ...regionMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [regionKey]: regionResolvers.show,
  },
}).AndMenuRoute(regionMenuItem);

export { DetailsComponent };
