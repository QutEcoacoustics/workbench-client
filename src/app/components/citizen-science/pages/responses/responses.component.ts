import { Component } from "@angular/core";
import {
  citSciCategory,
  citSciResponsesMenuItem,
} from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-citsci-responses",
  template: "<baw-client></baw-client>",
})
class CitSciResponsesComponent extends PageComponent {}

CitSciResponsesComponent.linkToRouterWith(
  { category: citSciCategory, fullscreen: true },
  citSciResponsesMenuItem
);

export { CitSciResponsesComponent };
