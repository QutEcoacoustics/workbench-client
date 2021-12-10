import { Component } from "@angular/core";
import {
  listenCategory,
  listenMenuItem,
} from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-listen",
  template: "<baw-client></baw-client>",
})
class ListenComponent extends PageComponent {}

ListenComponent.linkToRoute({
  category: listenCategory,
  pageRoute: listenMenuItem,
});

export { ListenComponent };
