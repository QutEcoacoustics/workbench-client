import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { HomeComponent } from "./home.component";
import { homeRoute } from "./home.menus";

const pages = [HomeComponent];
const routes = homeRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class HomeModule {}
