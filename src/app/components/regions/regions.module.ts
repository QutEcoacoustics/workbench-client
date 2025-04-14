import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProjectsModule } from "@components/projects/projects.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { regionsRoute, shallowRegionsRoute } from "./regions.routes";

const components = [
  DetailsComponent,
  EditComponent,
  ListComponent,
  NewComponent,
];

const routes = regionsRoute.compileRoutes(getRouteConfigForPage);
const shallowRoutes = shallowRegionsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [
    SharedModule,
    ProjectsModule,
    RouterModule.forChild([...routes, ...shallowRoutes]),
    ...components,
  ],
  exports: [RouterModule, ...components],
})
export class RegionsModule {}
