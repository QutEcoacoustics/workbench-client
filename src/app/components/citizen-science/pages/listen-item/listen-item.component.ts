import { Component } from "@angular/core";
import {
  citSciCategory,
  citSciListenItemMenuItem,
} from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "@shared/baw-client/baw-client.component";

@Component({
  selector: "baw-citsci-listen-item",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class CitSciListenItemComponent extends PageComponent {}

CitSciListenItemComponent.linkToRoute({
  category: citSciCategory,
  pageRoute: citSciListenItemMenuItem,
  fullscreen: true,
});

export { CitSciListenItemComponent };
