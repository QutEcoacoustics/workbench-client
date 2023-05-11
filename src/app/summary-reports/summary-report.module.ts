import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { GenerateSummaryReportComponent } from "./pages/generate/generate.component";
import { SummaryReportComponent } from "./pages/report/report.component";
import { projectGenerateReportRoute } from "./summary-report.routes";

const internalComponents = [
  GenerateSummaryReportComponent,
  SummaryReportComponent,
];

const components = [];

const routes = projectGenerateReportRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: [...internalComponents, ...components],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class SummaryReportModule {}
