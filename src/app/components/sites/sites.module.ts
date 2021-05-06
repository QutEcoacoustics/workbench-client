import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RegionsModule } from "@components/regions/regions.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { SiteAnnotationsComponent } from "./pages/annotations/annotations.component";
import { SiteDeleteComponent } from "./pages/delete/site.component";
import { SiteDetailsComponent } from "./pages/details/site.component";
import { SiteEditComponent } from "./pages/edit/site.component";
import { SiteHarvestComponent } from "./pages/harvest/site.component";
import { SiteNewComponent } from "./pages/new/site.component";
import { WizardComponent } from "./pages/wizard/wizard.component";
import { SiteComponent } from "./site/site.component";
import { sitesRoute } from "./sites.menus";

const components = [
  SiteAnnotationsComponent,
  SiteComponent,
  SiteDeleteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteHarvestComponent,
  SiteNewComponent,
  WizardComponent,
];

const routes = sitesRoute.compileRoutes(getRouteConfigForPage);

/**
 * Sites Module
 */
@NgModule({
  declarations: components,
  imports: [
    MapModule,
    RegionsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule, ...components],
})
export class SitesModule {}
