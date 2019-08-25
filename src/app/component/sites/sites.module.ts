import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/interfaces/pageRouting";
import { DetailsComponent } from "./pages/details/details.component";
import { sitesRoute } from "./sites.menus";

export const SitesComponents = [DetailsComponent];

const routes = sitesRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [SitesComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...SitesComponents]
})
export class SitesModule {}
