import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AnalysisJobComponent } from "./pages/details/details.component";
import { AnalysesComponent } from "./pages/list/list.component";
import { audioAnalysisRoute } from "./audio-analysis.routes";
import { AnalysisJobResultsComponent } from "./pages/results/results.component";
import { NewAnalysisJobComponent } from "./pages/new/new.component";

const components = [
  AnalysesComponent,
  NewAnalysisJobComponent,
  AnalysisJobComponent,
  AnalysisJobResultsComponent,
];

const routes = audioAnalysisRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioAnalysisModule {}
