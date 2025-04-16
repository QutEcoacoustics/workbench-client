import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { audioRecordingsRoutes } from "./audio-recording.routes";
import { AudioRecordingsDetailsComponent } from "./pages/details/details.component";
import { DownloadAudioRecordingsComponent } from "./pages/download/download.component";
import { AudioRecordingsListComponent } from "./pages/list/list.component";

const pages = [
  AudioRecordingsListComponent,
  AudioRecordingsDetailsComponent,
  DownloadAudioRecordingsComponent,
];

const routes = Object.values(audioRecordingsRoutes)
  .map((route) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class AudioRecordingModule {}
