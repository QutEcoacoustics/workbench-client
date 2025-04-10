import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AnalysisJobComponent } from "./pages/details/details.component";
import { AnalysesComponent } from "./pages/list/list.component";
import { analysesRoute } from "./analysis-jobs.routes";

const components = [
  AnalysesComponent,
  AnalysisJobComponent,
];

const routes = analysesRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes), ...components],
    exports: [RouterModule, ...components],
})
export class AnalysisModule {}
