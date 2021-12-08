import { Component } from "@angular/core";
import {
  citSciCategory,
  citSciListenItemMenuItem,
} from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-citsci-listen-item",
  template: "<baw-client></baw-client>",
})
class CitSciListenItemComponent extends PageComponent {}

CitSciListenItemComponent.linkToRouterWith(
  { category: citSciCategory, fullscreen: true },
  citSciListenItemMenuItem
);

export { CitSciListenItemComponent };
