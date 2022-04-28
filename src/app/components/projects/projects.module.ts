import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { HarvestCompleteComponent } from "./components/harvest/complete.component";
import { HarvestReviewComponent } from "./components/harvest/review.component";
import { HarvestMetadataReviewComponent } from "./components/harvest/metadata-review.component";
import { SiteCardComponent } from "./components/site-card/site-card.component";
import { SiteMapComponent } from "./components/site-map/site-map.component";
import { AssignComponent } from "./pages/assign/assign.component";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { HarvestComponent } from "./pages/harvest/harvest.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { PermissionsComponent } from "./pages/permissions/permissions.component";
import { RequestComponent } from "./pages/request/request.component";
import { projectsRoute } from "./projects.routes";
import { HarvestBatchUploadingComponent } from "./components/harvest/batch-uploading.component";
import { HarvestMetadataExtractionComponent } from "./components/harvest/metadata-extraction.component";
import { HarvestNewComponent } from "./components/harvest/new.component";
import { HarvestProcessingComponent } from "./components/harvest/processing.component";
import { HarvestStreamUploadingComponent } from "./components/harvest/stream-uploading.component";
import { UploadAnnotationsComponent } from "./pages/upload-annotations/upload-annotations.component";

const components = [
  HarvestNewComponent,
  HarvestStreamUploadingComponent,
  HarvestBatchUploadingComponent,
  HarvestMetadataExtractionComponent,
  HarvestProcessingComponent,
  HarvestMetadataReviewComponent,
  HarvestReviewComponent,
  HarvestCompleteComponent,

  UploadAnnotationsComponent,
  AssignComponent,
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  HarvestComponent,
  ListComponent,
  NewComponent,
  PermissionsComponent,
  RequestComponent,
  SiteCardComponent,
  SiteMapComponent,
];

const routes = projectsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [MapModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class ProjectsModule {}
