import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { SiteSelectorComponent } from "./components/inputs/site-selector.component";
import { UTCOffsetSelectorComponent } from "./components/inputs/utc-offset-selector.component";
import { FileRowComponent } from "./components/metadata-review/file-row.component";
import { FolderRowComponent } from "./components/metadata-review/folder-row.component";
import { LoadMoreComponent } from "./components/metadata-review/load-more.component";
import { WhitespaceComponent } from "./components/metadata-review/whitespace.component";
import { ConfirmationComponent } from "./components/modal/confirmation.component";
import { CanCloseDialogComponent } from "./components/shared/can-close-dialog.component";
import { EtaComponent } from "./components/shared/eta.component";
import { StatisticGroupComponent } from "./components/shared/statistics/group.component";
import { StatisticItemComponent } from "./components/shared/statistics/item.component";
import { StatisticsComponent } from "./components/shared/statistics/statistics.component";
import { TitleComponent } from "./components/shared/title.component";
import { UploadUrlComponent } from "./components/shared/upload-url.component";
import { harvestsRoute } from "./harvest.routes";
import { DetailsComponent } from "./pages/details/details.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { CompleteComponent } from "./screens/complete/complete.component";
import { ErrorComponent } from "./screens/error/error.component";
import { MetadataExtractionComponent } from "./screens/metadata-extraction/metadata-extraction.component";
import { MetadataReviewComponent } from "./screens/metadata-review/metadata-review.component";
import { ProcessingComponent } from "./screens/processing/processing.component";
import { ScanningComponent } from "./screens/scanning/scanning.component";
import { BatchUploadingComponent } from "./screens/uploading/batch-uploading.component";
import { StreamUploadingComponent } from "./screens/uploading/stream-uploading.component";
import { ValidationsWidgetComponent } from "./widgets/validations.component";

const internalComponents = [
  // Screens
  BatchUploadingComponent,
  CompleteComponent,
  ErrorComponent,
  MetadataExtractionComponent,
  MetadataReviewComponent,
  ProcessingComponent,
  ScanningComponent,
  StreamUploadingComponent,

  // Shared
  CanCloseDialogComponent,
  EtaComponent,
  StatisticGroupComponent,
  StatisticItemComponent,
  StatisticsComponent,
  TitleComponent,
  UploadUrlComponent,

  // Modals
  ConfirmationComponent,

  // Widgets
  ValidationsWidgetComponent,

  // Meta Review
  FileRowComponent,
  FolderRowComponent,
  LoadMoreComponent,
  WhitespaceComponent,

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
