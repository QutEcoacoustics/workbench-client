import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { MapModule } from "../shared/map/map.module";
import { DeleteComponent } from "./pages/delete/delete.component";
import { DetailsComponent } from "./pages/details/details.component";
import { EditComponent } from "./pages/edit/edit.component";
import { HarvestComponent } from "./pages/harvest/harvest.component";
import { NewComponent } from "./pages/new/new.component";
import { sitesRoute } from "./sites.menus";

export const sitesComponents = [
  DeleteComponent,
  DetailsComponent,
  EditComponent,
  HarvestComponent,
  NewComponent
];

const routes = sitesRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: sitesComponents,
  imports: [
    MapModule,
    SharedModule,
    AgmSnazzyInfoWindowModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule, ...sitesComponents]
})
export class SitesModule {}
