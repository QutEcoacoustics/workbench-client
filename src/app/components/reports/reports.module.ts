import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { NgModule } from "@angular/core";
import { ProjectsModule } from "../projects/projects.module";
import { NewEventReportComponent } from "./pages/event-summary/new/new.component";
import { ViewEventReportComponent } from "./pages/event-summary/view/view.component";
import { reportsRoute } from "./reports.routes";

const components = [
  NewEventReportComponent,
  ViewEventReportComponent,
];

const routes = Object.values(reportsRoute)
  .map((route) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  declarations: components,
  exports: [RouterModule, ...components],
  imports: [SharedModule, RouterModule.forChild(routes), ProjectsModule],
})
export class ReportsModule {}
