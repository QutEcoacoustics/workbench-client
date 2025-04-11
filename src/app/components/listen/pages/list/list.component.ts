import { Component } from "@angular/core";
import { listenCategory, listenMenuItem } from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "../../../shared/baw-client/baw-client.component";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-listen",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class ListenComponent extends PageComponent {}

ListenComponent.linkToRoute({
  category: listenCategory,
  pageRoute: listenMenuItem,
});

export { ListenComponent };
