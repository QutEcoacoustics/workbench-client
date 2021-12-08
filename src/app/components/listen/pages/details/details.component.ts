import { Component } from "@angular/core";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import {
  listenCategory,
  listenRecordingMenuItem,
} from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-listen-recording",
  template: "<baw-client></baw-client>",
})
class ListenRecordingComponent extends PageComponent {}

ListenRecordingComponent.linkToRouterWith(
  {
    category: listenCategory,
    fullscreen: true,
    resolvers: { audioRecording: audioRecordingResolvers.show },
  },
  listenRecordingMenuItem
);

export { ListenRecordingComponent };
