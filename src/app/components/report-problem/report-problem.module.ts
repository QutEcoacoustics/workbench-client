import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { ReportProblemComponent } from "./report-problem.component";
import { reportProblemsRoute } from "./report-problem.menus";

const pages = [ReportProblemComponent];
const routes = reportProblemsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class ReportProblemsModule {}
