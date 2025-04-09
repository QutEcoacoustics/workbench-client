import { Component } from "@angular/core";
import {
  visualizeCategory,
  visualizeMenuItem,
} from "@components/visualize/visualize.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-visualize",
  template: "<baw-client></baw-client>",
  standalone: false
})
class VisualizeComponent extends PageComponent {}

VisualizeComponent.linkToRoute({
  category: visualizeCategory,
  pageRoute: visualizeMenuItem,
  fullscreen: true,
});

export { VisualizeComponent };
