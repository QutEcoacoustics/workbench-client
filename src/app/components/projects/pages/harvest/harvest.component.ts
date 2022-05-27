import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { List } from "immutable";
import { harvestProjectMenuItem, projectCategory } from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

export enum HarvestStage {
  newHarvest,
  uploading,
  scanning,
  metadataExtraction,
  metadataReview,
  processing,
  review,
  complete,
}

export type UploadType = "batch" | "stream";

const projectKey = "project";

@Component({
  selector: "baw-harvest",
  templateUrl: "./harvest.component.html",
})
class HarvestComponent extends PageComponent implements OnInit {
  public project: Project;
  public stage: HarvestStage = HarvestStage.metadataReview;
  public harvestStage = HarvestStage;
  public isStreaming: boolean;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
  }

  public setStage(stage: HarvestStage): void {
    this.stage = stage;
  }

  public setType(stage: UploadType): void {
    this.isStreaming = stage === "stream";
  }
}

HarvestComponent.linkToRoute({
  category: projectCategory,
  pageRoute: harvestProjectMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { HarvestComponent };
