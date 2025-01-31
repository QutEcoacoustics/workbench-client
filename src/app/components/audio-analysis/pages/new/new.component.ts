import { Component } from "@angular/core";
import {
  audioAnalysisCategory,
  newAudioAnalysisJobMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { oldClientNewAnalysisJobRoute } from "@components/audio-analysis/audio-analysis.routes";
import { PageComponent } from "@helpers/page/pageComponent";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-new-audio-analyses",
  template: "<baw-client [page]='oldClientRoute'></baw-client>",
})
class NewAudioAnalysisJobComponent extends PageComponent {
  protected oldClientRoute = oldClientNewAnalysisJobRoute.toString();
}

NewAudioAnalysisJobComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: newAudioAnalysisJobMenuItem,
});

export { NewAudioAnalysisJobComponent };
