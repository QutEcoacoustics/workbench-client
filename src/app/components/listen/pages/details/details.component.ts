import { Component } from "@angular/core";
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
}).andMenuRoute(listenRecordingMenuItem);

export { ListenRecordingComponent };
