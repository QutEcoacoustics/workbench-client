import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { NgModule } from "@angular/core";
import { StrongRoute } from "@interfaces/strongRoute";
import { NewEventReportComponent } from "./pages/event-summary/new/new.component";
import { ViewEventReportComponent } from "./pages/event-summary/view/view.component";
import { reportsRoute } from "./reports.routes";

const pages = [NewEventReportComponent, ViewEventReportComponent];
const routes = Object.values(reportsRoute)
  .map((route: StrongRoute) => route.compileRoutes(getRouteConfigForPage))
  .flat();

@NgModule({
  exports: [RouterModule, ...pages],
  imports: [RouterModule.forChild(routes), ...pages],
})
export class ReportsModule {}
