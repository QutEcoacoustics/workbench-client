import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { pageNotFoundRoute } from "./error.menus";
import { PageNotFoundComponent } from "./page-not-found.component";
import { ResolverHandlerComponent } from "./resolver-handler.component";

const routes = pageNotFoundRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes)],
  declarations: [PageNotFoundComponent, ResolverHandlerComponent],
  exports: [PageNotFoundComponent, RouterModule, ResolverHandlerComponent],
})
export class ErrorModule {}
