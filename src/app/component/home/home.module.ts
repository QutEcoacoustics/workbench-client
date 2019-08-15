import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/interfaces/page.interfaces";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent, homeRoute } from "./home.component";

export const HomeComponents = [HomeComponent];

const routes: Routes = homeRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [HomeComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...HomeComponents]
})
export class HomeModule {}
