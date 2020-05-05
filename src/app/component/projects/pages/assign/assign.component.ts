import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem,
} from "@component/projects/projects.menus";
import { Page } from "@helpers/page/pageDecorator";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
  self: assignSiteMenuItem,
})
@Component({
  selector: "app-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"],
})
export class AssignComponent extends PagedTableTemplate<TableRow, Site> {
  // TODO Move this back into the admin dashboard
  public columns = [
    { name: "Site Id" },
    { name: "Name" },
    { name: "Description" },
  ];
  public sortKeys = {
    siteId: "id",
    name: "name",
    description: "description",
  };
  public filterKey = "name";

  constructor(api: ShallowSitesService, route: ActivatedRoute) {
    super(
      api,
      (sites) =>
        sites.map((site) => ({
          siteId: site.id,
          name: site.name,
          description: site.description,
        })),
      route
    );
  }

  public get project(): Project {
    return this.models.project as Project;
  }

  public onSelect(event) {
    console.log("Select: ", event);
  }
}

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
