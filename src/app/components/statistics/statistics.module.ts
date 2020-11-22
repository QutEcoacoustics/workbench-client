import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetRouteConfigForPage } from '@helpers/page/pageRouting';
import { SharedModule } from '@shared/shared.module';
import { StatisticsComponent } from './pages/statistics.component';
import { statisticsRoute } from './statistics.menus';

const components = [StatisticsComponent];
const routes = statisticsRoute.compileRoutes(GetRouteConfigForPage);

/**
 * Statistics module
 */
@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class StatisticsModule {}
