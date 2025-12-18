import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { harvestResolvers } from "@baw-api/harvest/harvest.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  harvestMenuItem,
  harvestsCategory,
} from "@components/harvest/harvest.menus";
import { harvestValidationsWidgetMenuItem } from "@components/harvest/widgets/validations.component";
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { List } from "immutable";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { WidgetMenuItem } from "@menu/widgetItem";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { StepperComponent } from "@shared/stepper/stepper.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { HarvestStagesService } from "../../services/harvest-stages.service";
import { harvestsMenuItemActions } from "../list/list.component";
import { TitleComponent } from "../../components/shared/title.component";
import { ErrorComponent } from "../../screens/error/error.component";
import { StreamUploadingComponent } from "../../screens/uploading/stream-uploading.component";
import { BatchUploadingComponent } from "../../screens/uploading/batch-uploading.component";
import { ScanningComponent } from "../../screens/scanning/scanning.component";
import { MetadataExtractionComponent } from "../../screens/metadata-extraction/metadata-extraction.component";
import { MetadataReviewComponent } from "../../screens/metadata-review/metadata-review.component";
import { ProcessingComponent } from "../../screens/processing/processing.component";
import { CompleteComponent } from "../../screens/complete/complete.component";

const projectKey = "project";
const harvestKey = "harvest";

@Component({
  selector: "baw-harvest",
  templateUrl: "./details.component.html",
  imports: [
    TitleComponent,
    StepperComponent,
    ErrorComponent,
    LoadingComponent,
    StreamUploadingComponent,
    BatchUploadingComponent,
    ScanningComponent,
    MetadataExtractionComponent,
    MetadataReviewComponent,
    ProcessingComponent,
    CompleteComponent,
  ],
})
class HarvestDetailsComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit, OnDestroy
{
  protected readonly stages = inject(HarvestStagesService);
  private readonly route = inject(ActivatedRoute);

  public project: Project;
  public harvest: Harvest;

  public ngOnInit(): void {
    const routeData = this.route.snapshot.data;
    this.harvest = routeData[harvestKey]?.model;
    this.project = routeData[projectKey].model;
    this.stages.initialize(this.project, this.harvest);
  }

  public ngOnDestroy(): void {
    this.stages.destroy();
  }
}

HarvestDetailsComponent.linkToRoute({
  category: harvestsCategory,
  menus: {
    actions: List([...harvestsMenuItemActions, newSiteMenuItem]),
    actionWidgets: List([
      harvestValidationsWidgetMenuItem,
      permissionsWidgetMenuItem,
      new WidgetMenuItem(WebsiteStatusWarningComponent, undefined, {
        feature: "isUploadingHealthy",
        message: `
         Uploading is temporarily unavailable.
          Please try again later.
        `,
      }),
    ]),
  },
  pageRoute: harvestMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
    [harvestKey]: harvestResolvers.show,
  },
});

export { HarvestDetailsComponent };
