import { Component } from "@angular/core";
import {
  libraryCategory,
  libraryMenuItem,
} from "@components/library/library.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { BawClientComponent } from "@shared/baw-client/baw-client.component";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-library",
  template: "<baw-client></baw-client>",
  imports: [BawClientComponent],
})
class LibraryComponent extends PageComponent {}

LibraryComponent.linkToRoute({
  category: libraryCategory,
  pageRoute: libraryMenuItem,
  fullscreen: true,
});

export { LibraryComponent };
