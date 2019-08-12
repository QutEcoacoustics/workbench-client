import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/interfaces/page.interfaces";
import { CardsModule } from "../shared/cards/cards.modules";
import { HomeComponent, homeRoute } from "./home.component";

export const HomeComponents = [HomeComponent];

const routes: Routes = homeRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [HomeComponents],
  imports: [CommonModule, CardsModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...HomeComponents]
})
export class HomeModule {}
