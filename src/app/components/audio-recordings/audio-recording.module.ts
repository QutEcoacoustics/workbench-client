import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioRecordingsRoutes } from "./audio-recording.menus";
import {
  DetailsComponent,
  PointDetailsComponent,
  ProjectDetailsComponent,
  RegionDetailsComponent,
  SiteDetailsComponent,
} from "./pages/details/details.component";
import {
  ListComponent,
  PointListComponent,
  ProjectListComponent,
  RegionListComponent,
  SiteListComponent,
} from "./pages/list/list.component";

const components = [
  ListComponent,
  SiteListComponent,
  PointListComponent,
  RegionListComponent,
  ProjectListComponent,

  DetailsComponent,
  SiteDetailsComponent,
  PointDetailsComponent,
  RegionDetailsComponent,
  ProjectDetailsComponent,
];

const routes = Object.values(audioRecordingsRoutes)
  .map((route) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioRecordingModule {}
