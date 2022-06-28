import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { SiteSelectorComponent } from "./components/inputs/site-selector.component";
import { UTCOffsetSelectorComponent } from "./components/inputs/utc-offset-selector.component";
import { CanCloseDialogComponent } from "./components/shared/can-close-dialog.component";
import {
  StatisticGroupComponent,
  StatisticItemComponent,
  StatisticsComponent,
} from "./components/shared/statistics.component";
import { TitleComponent } from "./components/shared/title.component";
import { UploadProgressComponent } from "./components/shared/upload-progress.component";
import { UploadUrlComponent } from "./components/shared/upload-url.component";
import { harvestsRoute } from "./harvest.routes";
import { DetailsComponent } from "./pages/details/details.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { CompleteComponent } from "./screens/complete/complete.component";
import { MetadataExtractionComponent } from "./screens/metadata-extraction/metadata-extraction.component";
import { MetadataReviewComponent } from "./screens/metadata-review/metadata-review.component";
import { ProcessingComponent } from "./screens/processing/processing.component";
import { ScanningComponent } from "./screens/scanning/scanning.component";
import { BatchUploadingComponent } from "./screens/uploading/batch-uploading.component";
import { StreamUploadingComponent } from "./screens/uploading/stream-uploading.component";

const internalComponents = [
  // Screens
  BatchUploadingComponent,
  CompleteComponent,
  MetadataExtractionComponent,
  MetadataReviewComponent,
  ProcessingComponent,
  ScanningComponent,
  StreamUploadingComponent,

  // Shared
  CanCloseDialogComponent,
  StatisticItemComponent,
  StatisticGroupComponent,
  StatisticsComponent,
  TitleComponent,
  UploadProgressComponent,
  UploadUrlComponent,

  // Input
  SiteSelectorComponent,
  UTCOffsetSelectorComponent,
];

const components = [
  // Pages
  DetailsComponent,
  ListComponent,
  NewComponent,
];

const routes = harvestsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: [...internalComponents, ...components],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class HarvestModule {}
