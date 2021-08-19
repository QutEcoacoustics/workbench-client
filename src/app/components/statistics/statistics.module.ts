import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
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
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class StatisticsModule {}
