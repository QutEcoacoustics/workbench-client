import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { citSciRoute } from "./citizen-science.menus";
import { CitSciAboutComponent } from "./pages/about/about.component";
import { CitSciListenItemComponent } from "./pages/listen-item/listen-item.component";
import { CitSciListenComponent } from "./pages/listen/listen.component";
import { CitSciResponsesComponent } from "./pages/responses/responses.component";

const components = [
  CitSciAboutComponent,
  CitSciListenComponent,
  CitSciListenItemComponent,
  CitSciResponsesComponent,
];

const routes = citSciRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class CitizenScienceModule {}
