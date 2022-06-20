import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { List } from "immutable";
import { harvestProjectMenuItem, projectCategory } from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";
import { HarvestStagesService } from "./harvest.service";

const projectKey = "project";

@Component({
  selector: "baw-harvest",
  templateUrl: "./harvest.component.html",
})
class HarvestComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit, OnDestroy
{
  public project: Project;

  public constructor(
    private route: ActivatedRoute,
    public stages: HarvestStagesService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
    this.stages.initialize(this.project);
  }

  public ngOnDestroy(): void {
    this.stages.stopPolling();
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
