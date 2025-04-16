import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { adminAnalysisJobsRoute } from "./analysis-jobs.menus";
import { AdminAnalysisJobComponent } from "./details/details.component";
import { AdminAnalysisJobsComponent } from "./list/list.component";

const pages = [AdminAnalysisJobComponent, AdminAnalysisJobsComponent];
const routes = adminAnalysisJobsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class AnalysisJobsModule {}
