import { Component } from "@angular/core";
import {
  citSciAboutMenuItem,
  citSciCategory,
} from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-citsci-about",
  template: "<baw-client></baw-client>",
})
class CitSciAboutComponent extends PageComponent {}

CitSciAboutComponent.linkToRouterWith(
  { category: citSciCategory, fullscreen: true },
  citSciAboutMenuItem
);

export { CitSciAboutComponent };
