import { Component } from "@angular/core";
import {
  visualizeCategory,
  visualizeMenuItem,
} from "@components/visualize/visualize.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "@shared/baw-client/baw-client.component";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-visualize",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class VisualizeComponent extends PageComponent {}

VisualizeComponent.linkToRoute({
  category: visualizeCategory,
  pageRoute: visualizeMenuItem,
  fullscreen: true,
});

export { VisualizeComponent };
