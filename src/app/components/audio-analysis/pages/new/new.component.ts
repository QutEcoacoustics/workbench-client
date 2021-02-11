import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  newAudioAnalysisMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-new-audio-analyses",
  template: "<baw-client></baw-client>",
})
class NewAudioAnalysisComponent extends PageComponent {}

NewAudioAnalysisComponent.linkComponentToPageInfo({
  category: audioAnalysisCategory,
}).andMenuRoute(newAudioAnalysisMenuItem);

export { NewAudioAnalysisComponent };
