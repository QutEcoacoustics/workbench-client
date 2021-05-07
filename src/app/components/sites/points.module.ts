import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SitesModule } from "@components/sites/sites.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { PointAnnotationsComponent } from "./pages/annotations/point.component";
import { PointDeleteComponent } from "./pages/delete/point.component";
import { PointDetailsComponent } from "./pages/details/point.component";
import { PointEditComponent } from "./pages/edit/point.component";
import { PointHarvestComponent } from "./pages/harvest/point.component";
import { PointNewComponent } from "./pages/new/point.component";
import { pointsRoute } from "./points.menus";

const components = [
  PointAnnotationsComponent,
  PointDeleteComponent,
  PointDetailsComponent,
  PointEditComponent,
  PointHarvestComponent,
  PointNewComponent,
];

const routes = pointsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, SitesModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class PointsModule {}
