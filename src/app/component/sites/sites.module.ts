import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { HarvestComponent } from "./pages/harvest/harvest.component";
import { NewComponent } from "./pages/new/new.component";
import { sitesRoute } from "./sites.menus";

const components = [
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  HarvestComponent,
  NewComponent,
];

const routes = sitesRoute.compileRoutes(GetRouteConfigForPage);

/**
 * Sites Module
 */
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
export class SitesModule {}
