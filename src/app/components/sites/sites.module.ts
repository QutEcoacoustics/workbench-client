import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { MapModule } from "@shared/map/map.module";
import { SharedModule } from "@shared/shared.module";
import { SiteDeleteComponent } from "./pages/delete/site.component";
import { SiteDetailsComponent } from "./pages/details/site.component";
import { SiteEditComponent } from "./pages/edit/site.component";
import { HarvestComponent } from "./pages/harvest/harvest.component";
import { SiteNewComponent } from "./pages/new/site.component";
import { WizardComponent } from "./pages/wizard/wizard.component";
import { SiteComponent } from "./site/site.component";
import { sitesRoute } from "./sites.menus";

const components = [
  HarvestComponent,
  SiteComponent,
  SiteDeleteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteNewComponent,
  WizardComponent,
];

const routes = sitesRoute.compileRoutes(GetRouteConfigForPage);

/**
 * Sites Module
 */
@NgModule({
  declarations: components,
  imports: [MapModule, SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class SitesModule {}
