import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProjectsModule } from "@components/projects/projects.module";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { NewComponent } from "./pages/new/new.component";
import { regionsRoute } from "./regions.menus";

const components = [
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  NewComponent,
];

const routes = regionsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, ProjectsModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class RegionsModule {}
