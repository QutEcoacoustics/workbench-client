import { Component } from "@angular/core";
import { citSciCategory, citSciResponsesMenuItem } from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "../../../shared/baw-client/baw-client.component";

@Component({
  selector: "baw-citsci-responses",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class CitSciResponsesComponent extends PageComponent {}

CitSciResponsesComponent.linkToRoute({
  category: citSciCategory,
  pageRoute: citSciResponsesMenuItem,
  fullscreen: true,
});

export { CitSciResponsesComponent };
