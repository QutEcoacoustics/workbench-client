import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioRecordingsRoutes } from "./audio-recording.menus";
import {
  AudioRecordingsDetailsComponent,
  AudioRecordingsDetailsFilteredBySiteComponent,
  AudioRecordingsDetailsFilteredBySiteAndRegionComponent,
  AudioRecordingsDetailsFilteredByRegionComponent,
  AudioRecordingsDetailsFilteredByProjectComponent,
} from "./pages/details/details.component";
import {
  AudioRecordingsListComponent,
  AudioRecordingsListFilteredBySiteComponent,
  AudioRecordingsListFilteredBySiteAndRegionComponent,
  AudioRecordingsListFilteredByRegionComponent,
  AudioRecordingsListFilteredByProjectComponent,
} from "./pages/list/list.component";

const components = [
  AudioRecordingsListComponent,
  AudioRecordingsListFilteredBySiteComponent,
  AudioRecordingsListFilteredBySiteAndRegionComponent,
  AudioRecordingsListFilteredByRegionComponent,
  AudioRecordingsListFilteredByProjectComponent,

  AudioRecordingsDetailsComponent,
  AudioRecordingsDetailsFilteredBySiteComponent,
  AudioRecordingsDetailsFilteredBySiteComponent,
  AudioRecordingsDetailsFilteredBySiteAndRegionComponent,
  AudioRecordingsDetailsFilteredByRegionComponent,
  AudioRecordingsDetailsFilteredByProjectComponent,
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
