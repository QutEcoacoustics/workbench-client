import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SendAudioComponent } from "./send-audio.component";
import { sendAudioRoute } from "./send-audio.menus";

const components = [SendAudioComponent];
const routes = sendAudioRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...components],
  exports: [RouterModule, ...components],
})
export class SendAudioModule {}
