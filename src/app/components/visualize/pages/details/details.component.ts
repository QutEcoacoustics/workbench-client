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
})
class VisualizeComponent extends PageComponent {}

VisualizeComponent.linkToRouterWith(
  { category: visualizeCategory, fullscreen: true },
  visualizeMenuItem
);

export { VisualizeComponent };
