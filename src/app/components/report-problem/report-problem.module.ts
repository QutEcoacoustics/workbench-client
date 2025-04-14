import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { ReportProblemComponent } from "./report-problem.component";
import { reportProblemsRoute } from "./report-problem.menus";

const components = [ReportProblemComponent];
const routes = reportProblemsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class ReportProblemsModule {}
