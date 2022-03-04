import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RegionsModule } from "@components/regions/regions.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { RecentAnnotationsComponent } from "./components/recent-annotations/recent-annotations.component";
import { SiteComponent } from "./components/site/site.component";
import { SiteDeleteComponent } from "./pages/delete/delete.component";
import { SiteDetailsComponent } from "./pages/details/details.component";
import { SiteEditComponent } from "./pages/edit/edit.component";
import { SiteHarvestComponent } from "./pages/harvest/harvest.component";
import { SiteNewComponent } from "./pages/new/new.component";
import { WizardComponent } from "./pages/wizard/wizard.component";
import { pointsRoute } from "./points.routes";
import { sitesRoute } from "./sites.routes";

const components = [
  SiteComponent,
  SiteDeleteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteHarvestComponent,
  SiteNewComponent,
  WizardComponent,
  RecentAnnotationsComponent,
];

const siteRoutes = sitesRoute.compileRoutes(getRouteConfigForPage);
const pointRoutes = pointsRoute.compileRoutes(getRouteConfigForPage);

/**
 * Sites Module
 */
@NgModule({
  declarations: components,
  imports: [
    MapModule,
    RegionsModule,
    SharedModule,
    RouterModule.forChild([...siteRoutes, ...pointRoutes]),
  ],
  exports: [RouterModule, ...components],
})
export class SitesModule {}
