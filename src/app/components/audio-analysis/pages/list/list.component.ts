import { Component } from "@angular/core";
import {
  audioAnalysesMenuItem,
  audioAnalysisCategory,
  newAudioAnalysisMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-audio-analyses",
  template: "<baw-client></baw-client>",
})
class AudioAnalysesComponent extends PageComponent {}

AudioAnalysesComponent.linkToRoute({
  category: audioAnalysisCategory,
  menuRoute: audioAnalysesMenuItem,
  menus: { actions: List([newAudioAnalysisMenuItem]) },
});

export { AudioAnalysesComponent };
