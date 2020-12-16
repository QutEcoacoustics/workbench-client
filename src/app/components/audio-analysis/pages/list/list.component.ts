import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  audioAnalysisMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-audio-analyses",
  template: "<baw-iframe></baw-iframe>",
})
class ListComponent extends PageComponent {}

ListComponent.linkComponentToPageInfo({
  category: audioAnalysisCategory,
}).andMenuRoute(audioAnalysisMenuItem);

export { ListComponent };
