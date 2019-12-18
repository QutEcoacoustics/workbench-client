import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { MyAccountEditComponent } from "./pages/my-account-edit/my-account-edit.component";
import {
  MyAccountProfileComponent,
  ProfileComponent
} from "./pages/profile/profile.component";
import { myAccountRoute, profileRoute } from "./profile.menus";
import { EditComponent } from './pages/edit/edit.component';

export const MyAccountComponents = [
  MyAccountProfileComponent,
  MyAccountEditComponent
];
export const ProfileComponents = [ProfileComponent];

const myAccountRoutes = myAccountRoute.compileRoutes(GetRouteConfigForPage);
const profileRoutes = profileRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [MyAccountComponents, EditComponent],
  imports: [SharedModule, RouterModule.forChild(myAccountRoutes)],
  exports: [RouterModule, ...MyAccountComponents]
})
export class MyAccountModule {}

@NgModule({
  declarations: [ProfileComponents],
  imports: [SharedModule, RouterModule.forChild(profileRoutes)],
  exports: [RouterModule, ...ProfileComponents]
})
export class ProfileModule {}
