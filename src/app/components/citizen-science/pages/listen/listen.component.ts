import { Component } from "@angular/core";
import {
  citSciCategory,
  citSciListenMenuItem,
} from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-citsci-listen",
  template: "<baw-client></baw-client>",
})
class CitSciListenComponent extends PageComponent {}

CitSciListenComponent.linkComponentToPageInfo({
  category: citSciCategory,
  fullscreen: true,
}).andMenuRoute(citSciListenMenuItem);

export { CitSciListenComponent };
