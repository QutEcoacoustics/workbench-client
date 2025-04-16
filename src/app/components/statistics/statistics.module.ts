import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { StatisticsComponent } from "./pages/statistics.component";
import { statisticsRoute } from "./statistics.menus";

const pages = [StatisticsComponent];
const routes = statisticsRoute.compileRoutes(getRouteConfigForPage);

/**
 * Statistics module
 */
@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class StatisticsModule {}
