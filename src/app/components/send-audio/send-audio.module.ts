import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { SendAudioComponent } from "./send-audio.component";
import { sendAudioRoute } from "./send-audio.menus";

const components = [SendAudioComponent];
const routes = sendAudioRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class SendAudioModule {}
