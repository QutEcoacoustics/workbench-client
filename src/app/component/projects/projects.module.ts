import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { RequestComponent } from "./pages/request/request.component";
import { projectsRoute } from "./projects.menus";

export const ProjectsComponents = [
  ListComponent,
  DetailsComponent,
  NewComponent,
  EditComponent,
  RequestComponent
];

const routes = projectsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [ProjectsComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...ProjectsComponents]
})
export class ProjectsModule {}
