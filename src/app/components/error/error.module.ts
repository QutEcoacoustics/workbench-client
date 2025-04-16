import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { pageNotFoundRoute } from "./error.menus";
import { PageNotFoundComponent } from "./page-not-found.component";

const pages = [PageNotFoundComponent];
const routes = pageNotFoundRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class ErrorModule {}
