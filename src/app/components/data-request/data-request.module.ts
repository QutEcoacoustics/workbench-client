import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { DataRequestComponent } from "./data-request.component";
import { dataRequestRoute } from "./data-request.menus";

const components = [DataRequestComponent];
const routes = dataRequestRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class DataRequestModule {}
