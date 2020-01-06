import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { MyEditComponent } from "./pages/my-edit/my-edit.component";
import { MyProfileComponent } from "./pages/profile/my-profile.component copy";
import { TheirProfileComponent } from "./pages/profile/their-profile.component";
import { TheirEditComponent } from "./pages/their-edit/their-edit.component";
import { myAccountRoute, theirProfileRoute } from "./profile.menus";

export const MyAccountComponents = [MyProfileComponent, MyEditComponent];
export const TheirProfileComponents = [
  TheirProfileComponent,
  TheirEditComponent
];

const myAccountRoutes = myAccountRoute.compileRoutes(GetRouteConfigForPage);
const profileRoutes = theirProfileRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [MyAccountComponents],
  imports: [SharedModule, RouterModule.forChild(myAccountRoutes)],
  exports: [RouterModule, ...MyAccountComponents]
})
export class MyAccountModule {}

@NgModule({
  declarations: [TheirProfileComponents],
  imports: [SharedModule, RouterModule.forChild(profileRoutes)],
  exports: [RouterModule, ...TheirProfileComponents]
})
export class ProfileModule {}
