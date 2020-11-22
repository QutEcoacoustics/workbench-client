import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetRouteConfigForPage } from '@helpers/page/pageRouting';
import { SharedModule } from '@shared/shared.module';
import { adminAudioRecordingsRoute } from './audio-recordings.menus';
import { AdminAudioRecordingComponent } from './details/details.component';
import { AdminAudioRecordingsComponent } from './list/list.component';

const components = [
  AdminAudioRecordingsComponent,
  AdminAudioRecordingComponent,
];
const routes = adminAudioRecordingsRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class AudioRecordingsModule {}
