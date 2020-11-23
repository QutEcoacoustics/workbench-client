import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { HarvestCompleteComponent } from "./harvest-complete/harvest-complete.component";
import { HarvestReviewComponent } from "./harvest-review/harvest-review.component";
import { AssignComponent } from "./pages/assign/assign.component";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { HarvestComponent } from "./pages/harvest/harvest.component";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";
import { PermissionsComponent } from "./pages/permissions/permissions.component";
import { RequestComponent } from "./pages/request/request.component";
import { PillListComponent } from "./pill-list/pill-list.component";
import { projectsRoute } from "./projects.menus";
import { SiteCardComponent } from "./site-card/site-card.component";
import { SiteMapComponent } from "./site-map/site-map.component";

const components = [
  AssignComponent,
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  HarvestCompleteComponent,
  HarvestComponent,
  HarvestReviewComponent,
  ListComponent,
  NewComponent,
  PermissionsComponent,
  PillListComponent,
  RequestComponent,
  SiteCardComponent,
  SiteMapComponent,
];

const routes = projectsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [MapModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class ProjectsModule {}
