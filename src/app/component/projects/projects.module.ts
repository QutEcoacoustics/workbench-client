import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { MapModule } from "../shared/map/map.module";
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
  RequestComponent,
  SiteCardComponent,
  SiteCardComponent,
  PillListComponent,
];

const routes = projectsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [
    MapModule,
    SharedModule,
    AgmSnazzyInfoWindowModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule, ...components],
})
export class ProjectsModule {}
