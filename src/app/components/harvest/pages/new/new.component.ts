import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HarvestsService } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  harvestsCategory,
  newHarvestMenuItem,
} from "@components/harvest/harvest.menus";
import { harvestRoute } from "@components/harvest/harvest.routes";
import { projectMenuItemActions } from "@components/projects/pages/details/details.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { PageComponent } from "@helpers/page/pageComponent";
import { Harvest, IHarvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastsService } from "@services/toasts/toasts.service";

const projectKey = "project";

@Component({
  selector: "baw-harvest-new",
  templateUrl: "new.component.html",
})
class NewComponent extends PageComponent implements OnInit {
  public loading: boolean;
  public project: Project;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notifications: ToastsService,
    private harvestApi: HarvestsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = this.route.snapshot.data[projectKey].model;
  }

  public onStreamingUploadClick(): void {
    this.createHarvest({ streaming: true });
  }

  public onBatchUploadClick(): void {
    this.createHarvest({ streaming: false });
  }

  private createHarvest(body: IHarvest) {
    this.loading = true;

    // We want this api request to complete regardless of component destruction
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi.create(new Harvest(body), this.project).subscribe({
      next: (harvest): void => {
        this.loading = false;
        this.router.navigateByUrl(
          harvestRoute.toRouterLink({
            projectId: this.project.id,
            harvestId: harvest.id,
          })
        );
      },
      error: (err: BawApiError): void => {
        this.loading = false;

        if (err.info?.project) {
          // Project has not enabled audio uploading
          this.notifications.error(err.info.project as string);
        } else {
          this.notifications.error(err.message);
        }
      },
    });
  }
}

NewComponent.linkToRoute({
  category: harvestsCategory,
  menus: { actions: List(projectMenuItemActions) },
  pageRoute: newHarvestMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { NewComponent };
