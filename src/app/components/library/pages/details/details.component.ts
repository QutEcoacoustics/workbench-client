import { Component } from "@angular/core";
import {
  annotationMenuItem,
  annotationsCategory,
} from "@components/library/library.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-annotation",
  template: "<baw-client></baw-client>",
})
class AnnotationComponent extends PageComponent {}

AnnotationComponent.linkComponentToPageInfo({
  category: annotationsCategory,
}).andMenuRoute(annotationMenuItem);

export { AnnotationComponent };
