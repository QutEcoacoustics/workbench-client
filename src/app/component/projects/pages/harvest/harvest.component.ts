import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import filesize from "filesize";
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
  public buttons: {
    previous: { disabled?: boolean; text?: string };
    next: { disabled?: boolean; text?: string };
  };
  public failure: boolean;
  public filesize = filesize;
  public harvest = Harvest;
  public progress: number;
  public project: Project;
  public stage: Harvest;
  private interval: number;
  private intervalSpeed = 300;

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
    this.stage = Harvest.Start;
    this.updateNavigation();
  }

  public nextStage() {
    this.stage++;
    clearInterval(this.interval);
    this.updateNavigation();
  }

  public previousStage() {
    // Review page should go to Credentials
    if (this.stage === Harvest.Review) {
      this.stage = Harvest.Credentials;
    } else {
      this.stage--;
    }

    clearInterval(this.interval);
    this.updateNavigation();
  }

  private mockTimer(callback?: () => void) {
    this.progress = 0;

    // https://github.com/TypeStrong/atom-typescript/issues/1053
    this.interval = (setInterval as any)(() => {
      this.progress++;

      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(this.interval);

        if (callback) {
          callback();
        }
      }
    }, this.intervalSpeed);
  }

  private updateNavigation() {
    const callback = () => {
      this.nextStage();
    };

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
        this.mockTimer();
        break;
      }
      case Harvest.Check: {
        this.buttons = {
          previous: {},
          next: {},
        };
        this.mockTimer(callback);
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
        this.mockTimer(callback);
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
