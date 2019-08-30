import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";
import { homeRoute } from "./home.menus";

export const HomeComponents = [HomeComponent];

const routes = homeRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [HomeComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...HomeComponents]
})
export class HomeModule {}
