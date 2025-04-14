import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { ReportProblemComponent } from "./report-problem.component";
import { reportProblemsRoute } from "./report-problem.menus";

const components = [ReportProblemComponent];
const routes = reportProblemsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class ReportProblemsModule {}
