import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioAnalysesRoute } from "./audio-analysis.menus";
import { AudioAnalysisComponent } from "./pages/details/details.component";
import { AudioAnalysesComponent } from "./pages/list/list.component";
import { NewAudioAnalysisComponent } from "./pages/new/new.component";
import { AudioAnalysisResultsComponent } from "./pages/results/results.component";

const components = [
  AudioAnalysesComponent,
  NewAudioAnalysisComponent,
  AudioAnalysisComponent,
  AudioAnalysisResultsComponent,
];

const routes = audioAnalysesRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioAnalysisModule {}
