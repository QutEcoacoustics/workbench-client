import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { Page } from "src/app/helpers/page/pageDecorator";
import { PagedTableTemplate } from "src/app/helpers/tableTemplate/pagedTableTemplate";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import { ShallowSitesService } from "src/app/services/baw-api/sites.service";
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: assignSiteMenuItem
})
@Component({
  selector: "app-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"]
})
export class AssignComponent extends PagedTableTemplate<TableRow, Site>
  implements OnInit {
  // TODO Move this back into the admin dashboard

  public error: ApiErrorDetails;
  public pageNumber: number;
  public project: Project;
  public sites: Site[];
  public totalSites: number;

  constructor(private route: ActivatedRoute, api: ShallowSitesService) {
    super(api, sites =>
      sites.map(site => ({
        siteId: site.id,
        name: site.name,
        description: site.description
      }))
    );
  }

  ngOnInit() {
    this.columns = [
      { name: "Site Id" },
      { name: "Name" },
      { name: "Description" }
    ];
    this.sortKeys = {
      siteId: "id",
      name: "name",
      description: "description"
    };
    this.filterKey = "id";

    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;

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
