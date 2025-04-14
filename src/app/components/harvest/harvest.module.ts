import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { harvestsRoute } from "./harvest.routes";
import { DetailsComponent } from "./pages/details/details.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";

const pageComponents = [
  // Pages
  DetailsComponent,
  ListComponent,
  NewComponent,
];

const routes = harvestsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pageComponents],
  exports: [RouterModule, ...pageComponents],
})
export class HarvestModule {}
