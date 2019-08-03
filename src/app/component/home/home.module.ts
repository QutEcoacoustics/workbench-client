import { homeCategory, HomeComponent } from "./home.component";
import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CardsModule } from "../shared/cards/cards.modules";
import { CommonModule } from "@angular/common";

export const HomeComponents = [HomeComponent];

const homeRoute = homeCategory.route;
const routes: Routes = [
  {
    path: homeRoute,
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponents],
  imports: [CommonModule, CardsModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...HomeComponents]
})
export class HomeModule {}
