import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { HomeComponent } from "./home.component";
import { homeRoute } from "./home.menus";

const components = [HomeComponent];
const routes = homeRoute.compileRoutes(getRouteConfigForPage);

console.log(routes);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class HomeModule {}
