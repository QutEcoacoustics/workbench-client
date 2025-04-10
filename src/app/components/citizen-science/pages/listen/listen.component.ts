import { Component } from "@angular/core";
import {
  citSciCategory,
  citSciListenMenuItem,
} from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "../../../shared/baw-client/baw-client.component";

@Component({
    selector: "baw-citsci-listen",
    template: "<baw-client></baw-client>",
    imports: [BawClientComponent]
})
class CitSciListenComponent extends PageComponent {}

CitSciListenComponent.linkToRoute({
  category: citSciCategory,
  pageRoute: citSciListenMenuItem,
  fullscreen: true,
});

export { CitSciListenComponent };
