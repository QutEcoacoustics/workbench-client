import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/interfaces/pageRouting";
import { DetailsComponent } from "./pages/details/details.component";
import { ListComponent } from "./pages/list/list.component";
import { projectsRoute } from "./projects.menus";

export const ProjectsComponents = [ListComponent, DetailsComponent];

const routes = projectsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [ProjectsComponents, DetailsComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...ProjectsComponents]
})
export class ProjectsModule {}
