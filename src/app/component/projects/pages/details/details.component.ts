import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { exploreAudioMenuItem } from "src/app/helpers/page/externalMenus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem
} from "../../projects.menus";

export const projectMenuItemActions = [
  exploreAudioMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem
];

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: projectMenuItem
})
@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public sites: Site[];

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;
    const siteModels: ResolvedModel<Site[]> = this.route.snapshot.data.sites;

    if (projectModel.error || siteModels.error) {
      return;
    }

    this.project = projectModel.model;
    this.sites = siteModels.model;
  }
}
