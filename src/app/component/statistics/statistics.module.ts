import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { StatisticsComponent } from "./pages/statistics.component";
import { statisticsRoute } from "./statistics.menus";

export const statisticsComponents = [StatisticsComponent];

const routes = statisticsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [statisticsComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, StatisticsComponent]
})
export class StatisticsModule {}
