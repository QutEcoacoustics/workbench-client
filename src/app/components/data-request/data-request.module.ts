import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { DataRequestComponent } from "./data-request.component";
import { dataRequestRoute } from "./data-request.menus";

const components = [DataRequestComponent];
const routes = dataRequestRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class DataRequestModule {}
