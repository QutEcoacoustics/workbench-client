import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioRecordingsRoutes } from "./audio-recording.menus";
import {
  DetailsComponent,
  PointDetailsComponent,
  ProjectDetailsComponent,
  ProjectsDetailsComponent,
  RegionDetailsComponent,
  RegionsDetailsComponent,
  SiteDetailsComponent,
} from "./pages/details/details.component";
import {
  ListComponent,
  PointListComponent,
  ProjectListComponent,
  ProjectsListComponent,
  RegionListComponent,
  RegionsListComponent,
  SiteListComponent,
} from "./pages/list/list.component";

const components = [
  ListComponent,
  SiteListComponent,
  PointListComponent,
  RegionListComponent,
  RegionsListComponent,
  ProjectListComponent,
  ProjectsListComponent,

  DetailsComponent,
  SiteDetailsComponent,
  PointDetailsComponent,
  RegionDetailsComponent,
  RegionsDetailsComponent,
  ProjectDetailsComponent,
  ProjectsDetailsComponent,
];

const routes = Object.values(audioRecordingsRoutes)
  .map((route) => route.compileRoutes(getRouteConfigForPage))
  .flat();

console.log(routes);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioRecordingModule {}
