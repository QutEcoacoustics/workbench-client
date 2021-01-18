import { Component } from "@angular/core";
import {
  libraryCategory,
  libraryMenuItem,
} from "@components/library/library.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-library",
  template: "<baw-client></baw-client>",
})
class LibraryComponent extends PageComponent {}

LibraryComponent.linkComponentToPageInfo({
  category: libraryCategory,
  fullscreen: true,
}).andMenuRoute(libraryMenuItem);

export { LibraryComponent };
