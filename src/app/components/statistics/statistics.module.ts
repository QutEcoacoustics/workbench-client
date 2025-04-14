import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { RecentAnnotationsComponent } from "./components/recent-annotations/recent-annotations.component";
import { RecentAudioRecordingsComponent } from "./components/recent-audio-recordings/recent-audio-recordings.component";
import { StatisticsComponent } from "./pages/statistics.component";
import { statisticsRoute } from "./statistics.menus";

const components = [
  StatisticsComponent,
  RecentAnnotationsComponent,
  RecentAudioRecordingsComponent,
];
const routes = statisticsRoute.compileRoutes(getRouteConfigForPage);

/**
 * Statistics module
 */
@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class StatisticsModule {}
