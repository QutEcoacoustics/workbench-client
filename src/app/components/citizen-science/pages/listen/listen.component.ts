import { Component } from "@angular/core";
import { citSciCategory, citSciListenMenuItem } from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-citsci-listen",
  template: "<baw-client></baw-client>",
  standalone: false,
})
class CitSciListenComponent extends PageComponent {}

CitSciListenComponent.linkToRoute({
  category: citSciCategory,
  pageRoute: citSciListenMenuItem,
  fullscreen: true,
});

export { CitSciListenComponent };
