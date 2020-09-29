import { Component, OnInit } from "@angular/core";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import {
  deleteRegionMenuItem,
  editRegionMenuItem,
  regionMenuItem,
  regionsCategory,
} from "@components/regions/regions.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";

export const regionMenuItemActions = [editRegionMenuItem, deleteRegionMenuItem];

const projectKey = "project";
const regionKey = "region";

/**
 * Region Details Component
 */
@Component({
  selector: "app-region",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
class DetailsComponent extends PageComponent implements OnInit {
  constructor() {
    super();
  }

  public ngOnInit(): void {}
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
