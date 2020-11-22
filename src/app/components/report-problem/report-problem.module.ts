import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetRouteConfigForPage } from '@helpers/page/pageRouting';
import { SharedModule } from '@shared/shared.module';
import { ReportProblemComponent } from './report-problem.component';
import { reportProblemsRoute } from './report-problem.menus';

const components = [ReportProblemComponent];
const routes = reportProblemsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class ReportProblemsModule {}
