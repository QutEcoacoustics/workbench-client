import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { VisualizeComponent } from "./pages/details/details.component";
import { visualizeRoute } from "./visualize.menus";

const components = [VisualizeComponent];

const routes = visualizeRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class VisualizeModule {}
