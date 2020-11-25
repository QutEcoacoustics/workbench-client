import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { adminAnalysisJobsRoute } from "./analysis-jobs.menus";
import { AdminAnalysisJobComponent } from "./details/details.component";
import { AdminAnalysisJobsComponent } from "./list/list.component";

const components = [AdminAnalysisJobComponent, AdminAnalysisJobsComponent];
const routes = adminAnalysisJobsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AnalysisJobsModule {}
