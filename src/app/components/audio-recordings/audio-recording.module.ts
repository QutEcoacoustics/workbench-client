import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import {
  audioRecordingsRoute,
  pointAudioRecordingsRoute,
  siteAudioRecordingsRoute,
} from "./audio-recording.menus";
import {
  DetailsComponent,
  PointDetailsComponent,
  SiteDetailsComponent,
} from "./pages/details/details.component";
import {
  ListComponent,
  PointListComponent,
  SiteListComponent,
} from "./pages/list/list.component";

const components = [
  ListComponent,
  SiteListComponent,
  PointListComponent,
  DetailsComponent,
  SiteDetailsComponent,
  PointDetailsComponent,
];

const baseRoutes = audioRecordingsRoute.compileRoutes(getRouteConfigForPage);
const siteRoutes = siteAudioRecordingsRoute.compileRoutes(
  getRouteConfigForPage
);
const pointRoutes = pointAudioRecordingsRoute.compileRoutes(
  getRouteConfigForPage
);

@NgModule({
  declarations: components,
  imports: [
    SharedModule,
    RouterModule.forChild([...baseRoutes, ...siteRoutes, ...pointRoutes]),
  ],
  exports: [RouterModule, ...components],
})
export class AudioRecordingModule {}
