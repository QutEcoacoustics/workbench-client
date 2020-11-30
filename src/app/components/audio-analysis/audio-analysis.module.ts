import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioAnalysisRoute } from "./audio-analysis.menus";
import { ListComponent } from "./pages/list/list.component";
import { NewComponent } from "./pages/new/new.component";

const components = [ListComponent, NewComponent];

const routes = audioAnalysisRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioAnalysisModule {}
