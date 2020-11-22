import { Component } from "@angular/core";
import { homeCategory } from "@components/home/home.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { pageNotFoundMenuItem } from "./error.menus";

@Component({
  selector: "baw-page-not-found",
  template: "<div>Not Found! TODO: make me better!</div>",
})
class PageNotFoundComponent extends PageComponent {}

PageNotFoundComponent.LinkComponentToPageInfo({
  category: homeCategory,
}).AndMenuRoute(pageNotFoundMenuItem);
export { PageNotFoundComponent };
