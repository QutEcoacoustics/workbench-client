import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  audioAnalysisMenuItem,
  newAudioAnalysisMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";

@Component({
  selector: "baw-audio-analyses",
  template: "<baw-client></baw-client>",
})
class ListComponent extends PageComponent {}

ListComponent.linkComponentToPageInfo({
  category: audioAnalysisCategory,
  menus: { actions: List([newAudioAnalysisMenuItem]) },
}).andMenuRoute(audioAnalysisMenuItem);

export { ListComponent };
