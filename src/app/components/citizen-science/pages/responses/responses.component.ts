import { Component } from "@angular/core";
import { citSciCategory, citSciResponsesMenuItem } from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-citsci-responses",
  template: "<baw-client></baw-client>",
  standalone: false,
})
class CitSciResponsesComponent extends PageComponent {}

CitSciResponsesComponent.linkToRoute({
  category: citSciCategory,
  pageRoute: citSciResponsesMenuItem,
  fullscreen: true,
});

export { CitSciResponsesComponent };
