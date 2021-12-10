import { Component } from "@angular/core";
import {
  libraryCategory,
  libraryMenuItem,
} from "@components/library/library.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-library",
  template: "<baw-client></baw-client>",
})
class LibraryComponent extends PageComponent {}

LibraryComponent.linkToRoute({
  category: libraryCategory,
  menuRoute: libraryMenuItem,
  fullscreen: true,
});

export { LibraryComponent };
