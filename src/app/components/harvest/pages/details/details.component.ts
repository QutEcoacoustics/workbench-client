import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { harvestResolvers } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  harvestMenuItem,
  harvestsCategory,
} from "@components/harvest/harvest.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { HarvestStagesService } from "../../services/harvest-stages.service";
import { harvestsMenuItemActions } from "../list/list.component";

const projectKey = "project";
const harvestKey = "harvest";

@Component({
  selector: "baw-harvest",
  templateUrl: "./details.component.html",
})
class DetailsComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit, OnDestroy
{
  public project: Project;

  public constructor(
    public stages: HarvestStagesService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    const harvest: Harvest = routeData[harvestKey]?.model;
    this.project = routeData[projectKey].model;
    this.stages.initialize(this.project, harvest);
  }

  public ngOnDestroy(): void {
    this.stages.stopPolling();
  }
}

DetailsComponent.linkToRoute({
  category: harvestsCategory,
  menus: { actions: List(harvestsMenuItemActions) },
  pageRoute: harvestMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
    [harvestKey]: harvestResolvers.show,
  },
});

export { DetailsComponent };
