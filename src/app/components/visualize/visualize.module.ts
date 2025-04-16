import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { VisualizeComponent } from "./pages/details/details.component";
import { visualizeRoute } from "./visualize.routes";

const pages = [VisualizeComponent];
const routes = visualizeRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class VisualizeModule {}
