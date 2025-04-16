import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { listenRoute } from "./listen.menus";
import { ListenComponent } from "./pages/list/list.component";
import { ListenRecordingComponent } from "./pages/details/details.component";

const pages = [ListenComponent, ListenRecordingComponent];
const routes = listenRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class ListenModule {}
