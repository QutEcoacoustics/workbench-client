import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { adminRoute } from "./admin.menus";

const components = [];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components]
})
export class AdminModule {}
