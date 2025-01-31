import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  newAudioAnalysisJobMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-new-audio-analyses",
  template: "<baw-client></baw-client>",
})
class NewAudioAnalysisJobComponent extends PageComponent {}

NewAudioAnalysisJobComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: newAudioAnalysisJobMenuItem,
});

export { NewAudioAnalysisJobComponent };
