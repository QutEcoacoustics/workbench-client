import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { ListComponent } from "./pages/list/list.component";
import { SiteSelectorComponent } from "./components/inputs/site-selector.component";
import { UTCOffsetSelectorComponent } from "./components/inputs/utc-offset-selector.component";
import { CanCloseDialogComponent } from "./components/shared/can-close-dialog.component";
import { UploadProgressComponent } from "./components/shared/upload-progress.component";
import { UploadUrlComponent } from "./components/shared/upload-url.component";
import { harvestsRoute } from "./harvest.routes";
import { StateComponent } from "./pages/state/state.component";
import { NewComponent } from "./pages/new/new.component";
import { CompleteComponent } from "./screens/complete/complete.component";
import { MetadataExtractionComponent } from "./screens/metadata-extraction/metadata-extraction.component";
import { MetadataReviewComponent } from "./screens/metadata-review/metadata-review.component";
import { ProcessingComponent } from "./screens/processing/processing.component";
import { ScanningComponent } from "./screens/scanning/scanning.component";
import { BatchUploadingComponent } from "./screens/uploading/batch-uploading.component";
import { StreamUploadingComponent } from "./screens/uploading/stream-uploading.component";
import { TitleComponent } from "./components/shared/title.component";

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
  UploadProgressComponent,
  CanCloseDialogComponent,
  UploadUrlComponent,
  TitleComponent,

  // Input
  SiteSelectorComponent,
  UTCOffsetSelectorComponent,
];

const components = [
  // Pages
  ListComponent,
  StateComponent,
  NewComponent,
];

const routes = harvestsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: [...internalComponents, ...components],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class HarvestModule {}
