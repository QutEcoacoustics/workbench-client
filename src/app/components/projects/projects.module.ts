import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { SiteCardComponent } from "./components/site-card/site-card.component";
import { SiteMapComponent } from "./components/site-map/site-map.component";
import { AssignComponent } from "./pages/assign/assign.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { PermissionsComponent } from "./pages/permissions/permissions.component";
import { RequestComponent } from "./pages/request/request.component";
import { projectsRoute } from "./projects.routes";

const components = [
  AssignComponent,
  DetailsComponent,
  EditComponent,
  ListComponent,
  NewComponent,
  PermissionsComponent,
  RequestComponent,
  SiteCardComponent,
  SiteMapComponent,
];

const routes = projectsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
    imports: [SharedModule, RouterModule.forChild(routes), ...components],
    exports: [RouterModule, ...components],
})
export class ProjectsModule {}
