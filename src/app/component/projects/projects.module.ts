import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { MapModule } from "../shared/map/map.module";
import { AssignComponent } from "./pages/assign/assign.component";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { PermissionsComponent } from "./pages/permissions/permissions.component";
import { RequestComponent } from "./pages/request/request.component";
import { projectsRoute } from "./projects.menus";
import { SiteCardComponent } from "./site-card/site-card.component";

export const projectsComponents = [
  AssignComponent,
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  ListComponent,
  NewComponent,
  PermissionsComponent,
  RequestComponent,
  SiteCardComponent,
  SiteCardComponent
];

const routes = projectsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: projectsComponents,
  imports: [
    MapModule,
    SharedModule,
    AgmSnazzyInfoWindowModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, ...projectsComponents]
})
export class ProjectsModule {}
