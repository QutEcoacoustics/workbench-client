import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { regionsRoute, shallowRegionsRoute } from "./regions.routes";

const pages = [
  DetailsComponent,
  EditComponent,
  ListComponent,
  NewComponent,
];

const routes = regionsRoute.compileRoutes(getRouteConfigForPage);
const shallowRoutes = shallowRegionsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [
    RouterModule.forChild([...routes, ...shallowRoutes]),
    ...pages,
  ],
  exports: [...pages],
})
export class RegionsModule {}
