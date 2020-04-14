import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { ShallowSitesService } from "@baw-api/sites.service";
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
export class AssignComponent extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  // TODO Move this back into the admin dashboard

  public project: Project;

  constructor(private route: ActivatedRoute, api: ShallowSitesService) {
    super(api, (sites) =>
      sites.map((site) => ({
        siteId: site.id,
        name: site.name,
        description: site.description,
      }))
    );
  }

  ngOnInit() {
    this.columns = [
      { name: "Site Id" },
      { name: "Name" },
      { name: "Description" },
    ];
    this.sortKeys = {
      siteId: "id",
      name: "name",
      description: "description",
    };
    this.filterKey = "name";

    const projectModel: ResolvedModel<Project> = this.route.snapshot.data[
      projectKey
    ];

    if (projectModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.getModels();
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
