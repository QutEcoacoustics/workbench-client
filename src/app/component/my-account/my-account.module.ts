import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { myAccountRoute } from "./my-account.menus";
import { EditComponent } from "./pages/edit/edit.component";
import { ProfileComponent } from "./pages/profile/profile.component";

export const MyAccountComponents = [ProfileComponent, EditComponent];

const routes = myAccountRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: [MyAccountComponents],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...MyAccountComponents]
})
export class MyAccountModule {}
