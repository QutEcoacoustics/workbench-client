import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { ListComponent } from "./pages/list/list.component";
import { SiteSelectorComponent } from "./components/inputs/site-selector.component";
import { UTCOffsetSelectorComponent } from "./components/inputs/utc-offset-selector.component";
import { HarvestCanCloseDialogComponent } from "./components/shared/can-close-dialog.component";
import { HarvestProgressComponent } from "./components/shared/progress.component";
import { HarvestUploadUrlComponent } from "./components/shared/upload-url.component";
import { harvestsRoute } from "./harvest.routes";
import { StateComponent } from "./pages/state/state.component";
import { NewComponent } from "./pages/new/new.component";
import { HarvestCompleteComponent } from "./screens/complete/complete.component";
import { HarvestMetadataExtractionComponent } from "./screens/metadata-extraction/metadata-extraction.component";
import { HarvestMetadataReviewComponent } from "./screens/metadata-review/metadata-review.component";
import { HarvestProcessingComponent } from "./screens/processing/processing.component";
import { HarvestScanningComponent } from "./screens/scanning/scanning.component";
import { HarvestBatchUploadingComponent } from "./screens/uploading/batch-uploading.component";
import { HarvestStreamUploadingComponent } from "./screens/uploading/stream-uploading.component";

const components = [
  // Screens
  HarvestBatchUploadingComponent,
  HarvestCompleteComponent,
  HarvestMetadataExtractionComponent,
  HarvestMetadataReviewComponent,
  HarvestProcessingComponent,
  HarvestScanningComponent,
  HarvestStreamUploadingComponent,

  // Shared
  HarvestProgressComponent,
  HarvestCanCloseDialogComponent,
  HarvestUploadUrlComponent,

  // Input
  SiteSelectorComponent,
  UTCOffsetSelectorComponent,

  // Pages
  ListComponent,
  StateComponent,
  NewComponent,
];

const routes = harvestsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class HarvestModule {}
