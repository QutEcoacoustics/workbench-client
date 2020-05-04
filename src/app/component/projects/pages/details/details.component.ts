import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/sites.service";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem,
} from "@component/projects/projects.menus";
import { newSiteMenuItem } from "@component/sites/sites.menus";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";

export const projectMenuItemActions = [
  exploreAudioMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem,
];

const projectKey = "project";
const sitesKey = "sites";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [sitesKey]: siteResolvers.list,
  },
  self: projectMenuItem,
})
@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public sites: Site[];

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data[
      projectKey
    ];
    const siteModels: ResolvedModel<Site[]> = this.route.snapshot.data[
      sitesKey
    ];

    if (projectModel.error || siteModels.error) {
      return;
    }

    this.project = projectModel.model;
    this.sites = siteModels.model;
  }
}
