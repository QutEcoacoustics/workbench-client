import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { AdminOrphanComponent } from "./details/details.component";
import { AdminOrphansComponent } from "./list/list.component";
import { adminOrphansRoute } from "./orphans.menus";

const components = [AdminOrphansComponent, AdminOrphanComponent];
const routes = adminOrphansRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class OrphanSitesModule {}
