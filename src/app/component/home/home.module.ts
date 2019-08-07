import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CardsModule } from "../shared/cards/cards.modules";
import { homeCategory, HomeComponent } from "./home.component";

export const HomeComponents = [HomeComponent];

const homeRoute = homeCategory.route;
const routes: Routes = [
  {
    path: homeRoute as string,
    component: HomeComponent
  }
];

@NgModule({
  declarations: [HomeComponents],
  imports: [CommonModule, CardsModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...HomeComponents]
})
export class HomeModule {}
