import { Component } from "@angular/core";
import {
  visualizeCategory,
  visualizeMenuItem,
} from "@components/visualize/visualize.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-visualize",
  template: "<baw-client></baw-client>",
})
class VisualizeComponent extends PageComponent {}

VisualizeComponent.linkComponentToPageInfo({
  category: visualizeCategory,
  fullscreen: true,
}).andMenuRoute(visualizeMenuItem);

export { VisualizeComponent };
