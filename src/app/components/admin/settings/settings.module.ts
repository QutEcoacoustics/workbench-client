import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { AdminSettingsComponent } from "./settings.component";
import { adminSettingsRoute } from "./settings.menus";

const pages = [AdminSettingsComponent];
const routes = adminSettingsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class SettingsModule {}
