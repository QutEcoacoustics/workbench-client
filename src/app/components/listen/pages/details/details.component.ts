import { Component } from "@angular/core";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import {
  listenCategory,
  listenRecordingMenuItem,
} from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-listen-recording",
  template: "<baw-client></baw-client>",
})
class ListenRecordingComponent extends PageComponent {}

ListenRecordingComponent.linkComponentToPageInfo({
  category: listenCategory,
  fullscreen: true,
  resolvers: { audioRecording: audioRecordingResolvers.show },
}).andMenuRoute(listenRecordingMenuItem);

export { ListenRecordingComponent };
