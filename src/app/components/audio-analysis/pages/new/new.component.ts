import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  newAudioAnalysisMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";

@Component({
  selector: "baw-new-audio-analyses",
  template: "<baw-client></baw-client>",
})
class NewComponent extends PageComponent {}

NewComponent.linkComponentToPageInfo({
  category: audioAnalysisCategory,
}).andMenuRoute(newAudioAnalysisMenuItem);

export { NewComponent };
