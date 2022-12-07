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
import { AnalysisResultsComponent } from "./pages/analysis-results/analysis-results.component";
import { DirectoryExplorerComponent } from "./components/directory-row/directory-explorer.component";
import { DirectoryRowComponent } from "./components/directory-row/directory-row.component";
import { DirectoryWhitespaceComponent } from "./components/directory-row/directory-whitespace.component";

const internalComponents = [
  SitesWithoutTimezonesComponent,
  DownloadTableComponent,
  DirectoryExplorerComponent,
  DirectoryRowComponent,
  DirectoryWhitespaceComponent,
];

const components = [
  AudioRecordingsListComponent,
  AudioRecordingsDetailsComponent,
  DownloadAudioRecordingsComponent,
  AnalysisResultsComponent,
];

const routes = Object.values(audioRecordingsRoutes)
  .map((route) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  declarations: [...components, internalComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioRecordingModule {}
