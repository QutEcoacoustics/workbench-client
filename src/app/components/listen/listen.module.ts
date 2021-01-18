import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { listenRoute } from "./listen.menus";
import { ListenComponent } from "./pages/list/list.component";
import { ListenRecordingComponent } from "./pages/details/details.component";

const components = [ListenComponent, ListenRecordingComponent];

const routes = listenRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class ListenModule {}
