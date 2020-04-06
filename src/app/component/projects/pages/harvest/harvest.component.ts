import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { projectResolvers } from "src/app/services/baw-api/projects.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import {
  harvestProjectMenuItem,
  projectCategory,
  projectMenuItem,
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

@Page({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
  self: harvestProjectMenuItem,
})
@Component({
  selector: "app-harvest",
  templateUrl: "./harvest.component.html",
  styleUrls: ["./harvest.component.scss"],
})
export class HarvestComponent implements OnInit {
  public state: Harvest;
  public harvest = Harvest;
  public failure: boolean;
  public project: Project;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const resolvedProject: ResolvedModel<Project> = this.route.snapshot.data[
      projectKey
    ];

    if (resolvedProject.error) {
      this.failure = true;
      return;
    }

    this.project = resolvedProject.model;
    this.state = Harvest.Start;
  }
}

enum Harvest {
  Start,
  Credentials,
  Check,
  Review,
  Harvest,
  Summary,
}
