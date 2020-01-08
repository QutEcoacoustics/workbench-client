import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { MapModule } from "../shared/map/map.module";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { RequestComponent } from "./pages/request/request.component";
import { projectsRoute } from "./projects.menus";
import { SiteCardComponent } from "./site-card/site-card.component";

export const ProjectsComponents = [
  ListComponent,
  DetailsComponent,
  NewComponent,
  EditComponent,
  RequestComponent,
  SiteCardComponent,
  SiteCardComponent,
  DeleteComponent
];

const routes = projectsRoute.compileRoutes(GetRouteConfigForPage);

console.log(routes);

@NgModule({
  declarations: [ProjectsComponents],
  imports: [
    MapModule,
    SharedModule,
    AgmSnazzyInfoWindowModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, ...ProjectsComponents]
})
export class ProjectsModule {}
