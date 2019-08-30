import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { GroupComponent } from "./helpers/group/group.component";
import { StatisticComponent } from "./helpers/statistic/statistic.component";
import { StatisticsComponent } from "./pages/statistics.component";
import { statisticsRoute } from "./statistics.menus";

export const statisticsComponents = [
  StatisticsComponent,
  StatisticComponent,
  GroupComponent
];

const routes = statisticsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [statisticsComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, StatisticsComponent]
})
export class StatisticsModule {}
