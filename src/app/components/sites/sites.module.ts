import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SiteComponent } from "./components/site/site.component";
import { SiteDetailsComponent } from "./pages/details/details.component";
import { SiteEditComponent } from "./pages/edit/edit.component";
import { SiteNewComponent } from "./pages/new/new.component";
import { WizardComponent } from "./pages/wizard/wizard.component";
import { pointsRoute } from "./points.routes";
import { sitesRoute } from "./sites.routes";

const pages = [
  SiteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteNewComponent,
  WizardComponent,
];

const siteRoutes = sitesRoute.compileRoutes(getRouteConfigForPage);
const pointRoutes = pointsRoute.compileRoutes(getRouteConfigForPage);

/**
 * Sites Module
 */
@NgModule({
  imports: [
    RouterModule.forChild([...siteRoutes, ...pointRoutes]),
    ...pages,
  ],
  exports: [RouterModule, ...pages],
})
export class SitesModule {}
