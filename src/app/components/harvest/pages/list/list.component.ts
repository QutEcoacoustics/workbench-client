import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Filters } from "@baw-api/baw-api.service";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  harvestsCategory,
  harvestsMenuItem,
  newHarvestMenuItem,
} from "@components/harvest/harvest.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { DateTime } from "luxon";

export const harvestsMenuItemActions = [newHarvestMenuItem];
const projectKey = "project";

@Component({
  selector: "baw-harvests",
  templateUrl: "list.component.html",
})
class ListComponent extends PageComponent implements OnInit {
  public project: Project;
  public filters: Filters<Harvest> = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  };

  public constructor(
    private harvestsApi: HarvestsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
  }

  public getModels = (filters: Filters<Harvest>) =>
    this.harvestsApi.filter(filters, this.project);

  public asHarvest(model: any): Harvest {
    return model;
  }

  public formatDate(date: DateTime): string {
    return date.toFormat("yyyy-MM-dd HH:mm:ss");
  }
}

ListComponent.linkToRoute({
  category: harvestsCategory,
  menus: {
    actions: List(harvestsMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  pageRoute: harvestsMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { ListComponent };
