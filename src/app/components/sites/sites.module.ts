import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RegionsModule } from "@components/regions/regions.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { RecentAnnotationsComponent } from "./components/recent-annotations/recent-annotations.component";
import { SiteComponent } from "./components/site/site.component";
import { SiteDetailsComponent } from "./pages/details/details.component";
import { SiteEditComponent } from "./pages/edit/edit.component";
import { SiteNewComponent } from "./pages/new/new.component";
import { WizardComponent } from "./pages/wizard/wizard.component";
import { pointsRoute } from "./points.routes";
import { sitesRoute } from "./sites.routes";
import { DeleteSiteModalComponent } from "./components/delete-site-modal/delete-site-modal.component";

const components = [
  SiteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteNewComponent,
  WizardComponent,
  RecentAnnotationsComponent,
  DeleteSiteModalComponent,
];

const siteRoutes = sitesRoute.compileRoutes(getRouteConfigForPage);
const pointRoutes = pointsRoute.compileRoutes(getRouteConfigForPage);

/**
 * Sites Module
 */
@NgModule({
  imports: [
    RegionsModule,
    RouterModule.forChild([...siteRoutes, ...pointRoutes]),
    ...components,
  ],
  exports: [RouterModule, ...components],
})
export class SitesModule {}
