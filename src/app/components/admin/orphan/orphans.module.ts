import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { AdminOrphanComponent } from "./details/details.component";
import { AdminOrphansComponent } from "./list/list.component";
import { adminOrphansRoute } from "./orphans.menus";

const components = [AdminOrphansComponent, AdminOrphanComponent];
const routes = adminOrphansRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class OrphanSitesModule {}
