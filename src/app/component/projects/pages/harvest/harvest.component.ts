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
  public stage: Harvest;
  public harvest = Harvest;
  public failure: boolean;
  public project: Project;
  public buttons: {
    previous: { disabled?: boolean; text?: string };
    next: { disabled?: boolean; text?: string };
  };
  public progress: number;

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
    this.stage = Harvest.Summary;
    this.updateNavigation();
  }

  public nextStage() {
    this.stage++;
    this.updateNavigation();
  }

  public previousStage() {
    this.stage--;
    this.updateNavigation();
  }

  private mockTimer() {
    this.progress = 0;

    const interval = setInterval(() => {
      this.progress++;

      if (this.progress >= 100) {
        this.progress = 100;
        this.nextStage();
        clearInterval(interval);
      }
    }, 300);
  }

  private updateNavigation() {
    switch (this.stage) {
      case Harvest.Start: {
        this.buttons = {
          previous: {},
          next: { text: "Start" },
        };
        break;
      }
      case Harvest.Credentials: {
        this.buttons = {
          previous: { text: "Cancel" },
          next: { text: "Finished Uploading" },
        };
        break;
      }
      case Harvest.Check: {
        this.buttons = {
          previous: {},
          next: {},
        };
        this.mockTimer();
        break;
      }
      case Harvest.Review: {
        this.buttons = {
          previous: { text: "Re-submit Files" },
          next: { text: "Finish Review" },
        };
        break;
      }
      case Harvest.Harvest: {
        this.buttons = {
          previous: {},
          next: {},
        };
        this.mockTimer();
        break;
      }
      case Harvest.Summary: {
        this.buttons = {
          previous: {},
          next: {},
        };
        break;
      }
    }
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
