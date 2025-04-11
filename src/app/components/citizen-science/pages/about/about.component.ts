import { Component } from "@angular/core";
import { citSciAboutMenuItem, citSciCategory } from "@components/citizen-science/citizen-science.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "../../../shared/baw-client/baw-client.component";

@Component({
  selector: "baw-citsci-about",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class CitSciAboutComponent extends PageComponent {}

CitSciAboutComponent.linkToRoute({
  category: citSciCategory,
  pageRoute: citSciAboutMenuItem,
  fullscreen: true,
});

export { CitSciAboutComponent };
