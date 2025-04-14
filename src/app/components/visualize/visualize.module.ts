import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { VisualizeComponent } from "./pages/details/details.component";
import { visualizeRoute } from "./visualize.routes";

const components = [VisualizeComponent];

const routes = visualizeRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class VisualizeModule {}
