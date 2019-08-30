import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { ReportProblemComponent } from "./report-problem.component";
import { reportProblemsRoute } from "./report-problem.menus";

export const reportProblemsComponents = [ReportProblemComponent];

const routes = reportProblemsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [reportProblemsComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...reportProblemsComponents]
})
export class ReportProblemsModule {}
