import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { audioRecordingsRoute } from "./audio-recording.menus";
import { DetailsComponent } from "./pages/details/details.component";
import { ListComponent } from "./pages/list/list.component";

const components = [ListComponent, DetailsComponent];

const routes = audioRecordingsRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioRecordingModule {}
