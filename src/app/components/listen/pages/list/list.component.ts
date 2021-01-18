import { Component } from "@angular/core";
import {
  listenCategory,
  listenMenuItem,
} from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-listen",
  template: "<baw-client></baw-client>",
})
class ListenComponent extends PageComponent {}

ListenComponent.linkComponentToPageInfo({
  category: listenCategory,
}).andMenuRoute(listenMenuItem);

export { ListenComponent };
