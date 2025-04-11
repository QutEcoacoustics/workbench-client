import { Component } from "@angular/core";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { listenCategory, listenRecordingMenuItem } from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "../../../shared/baw-client/baw-client.component";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-listen-recording",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class ListenRecordingComponent extends PageComponent {}

ListenRecordingComponent.linkToRoute({
  category: listenCategory,
  pageRoute: listenRecordingMenuItem,
  fullscreen: true,
  resolvers: { audioRecording: audioRecordingResolvers.show },
});

export { ListenRecordingComponent };
