import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { HarvestCompleteComponent } from "./components/harvest/complete/complete.component";
import { HarvestFileReviewComponent } from "./components/harvest/review/file.component";
import { HarvestUploadReviewComponent } from "./components/harvest/review/upload.component";
import { HarvestStartComponent } from "./components/harvest/start/start.component";
import { HarvestBatchUploadComponent } from "./components/harvest/upload/batch.component";
import { HarvestStreamUploadComponent } from "./components/harvest/upload/stream.component";
import { HarvestFileVerificationComponent } from "./components/harvest/verification/file.component";
import { HarvestUploadVerificationComponent } from "./components/harvest/verification/upload.component";
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

const components = [
  HarvestStartComponent,
  HarvestStreamUploadComponent,
  HarvestBatchUploadComponent,
  HarvestUploadVerificationComponent,
  HarvestFileVerificationComponent,
  HarvestUploadReviewComponent,
  HarvestFileReviewComponent,
  HarvestCompleteComponent,

  AssignComponent,
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  HarvestCompleteComponent,
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
