import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { pageNotFoundRoute } from "./error.menus";
import { PageNotFoundComponent } from "./page-not-found.component";
import { ResolverHandlerComponent } from "./resolver-handler.component";

const routes = pageNotFoundRoute.compileRoutes(getRouteConfigForPage);
const components = [PageNotFoundComponent, ResolverHandlerComponent];

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: components,
  exports: [...components, RouterModule],
})
export class ErrorModule {}
