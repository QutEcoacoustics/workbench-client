import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AudioAnalysisJobComponent } from "./pages/details/details.component";
import { AudioAnalysesComponent } from "./pages/list/list.component";
import { audioAnalysesRoute, oldClientAnalysesRoute } from "./audio-analysis.routes";
import { AudioAnalysisJobResultsComponent } from "./pages/results/results.component";
import { NewAudioAnalysisJobComponent } from "./pages/new/new.component";

const components = [
  AudioAnalysesComponent,
  NewAudioAnalysisJobComponent,
  AudioAnalysisJobComponent,
  AudioAnalysisJobResultsComponent,
];

const newRoutes = audioAnalysesRoute.compileRoutes(getRouteConfigForPage);
const oldClientRoutes = oldClientAnalysesRoute.compileRoutes(getRouteConfigForPage);
const routes = [...newRoutes, ...oldClientRoutes];

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioAnalysisModule {}
