import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { adminAnalysisJobsRoute } from "./analysis-jobs.menus";
import { DetailsComponent } from "./details/details.component";
import { ListComponent } from "./list/list.component";

const components = [DetailsComponent, ListComponent];
const routes = adminAnalysisJobsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AnalysisJobsModule {}
