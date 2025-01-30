import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AudioAnalysisJobComponent } from "./pages/details/details.component";
import { AudioAnalysesComponent } from "./pages/list/list.component";
import { NewAudioAnalysisComponent } from "./pages/new/new.component";
import { AudioAnalysisResultsComponent } from "./pages/results/results.component";
import { audioAnalysisRoute } from "./audio-analysis.routes";

const components = [
  AudioAnalysesComponent,
  NewAudioAnalysisComponent,
  AudioAnalysisJobComponent,
  AudioAnalysisResultsComponent,
];

const routes = audioAnalysisRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioAnalysisModule {}
