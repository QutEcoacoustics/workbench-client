import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RegionsModule } from "@components/regions/regions.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { SiteComponent } from "./components/site/site.component";
import { SiteDeleteComponent } from "./pages/delete/site.component";
import { SiteDetailsComponent } from "./pages/details/site.component";
import { SiteEditComponent } from "./pages/edit/site.component";
import { SiteHarvestComponent } from "./pages/harvest/site.component";
import { SiteNewComponent } from "./pages/new/site.component";
import { WizardComponent } from "./pages/wizard/wizard.component";
import { pointsRoute } from "./points.menus";
import { sitesRoute } from "./sites.menus";

const components = [
  SiteComponent,
  SiteDeleteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteHarvestComponent,
  SiteNewComponent,
  WizardComponent,
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
