import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioRecordingsRoutes } from "./audio-recording.routes";
import { DownloadTableComponent } from "./components/download-table/download-table.component";
import { AudioRecordingsDetailsComponent } from "./pages/details/details.component";
import { DownloadAudioRecordingsComponent } from "./pages/download/download.component";
import { AudioRecordingsListComponent } from "./pages/list/list.component";
import { SitesWithoutTimezonesComponent } from "./components/sites-without-timezones/sites-without-timezones.component";

const internalComponents = [
  SitesWithoutTimezonesComponent,
  DownloadTableComponent,
];

const components = [
  AudioRecordingsListComponent,
  AudioRecordingsDetailsComponent,
  DownloadAudioRecordingsComponent,
];

const routes = Object.values(audioRecordingsRoutes)
  .map((route) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes), ...components, internalComponents],
    exports: [RouterModule, ...components],
})
export class AudioRecordingModule {}
