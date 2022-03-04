import { Component } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  audioAnalysisCategory,
  audioAnalysisMenuItem,
  audioAnalysisResultsMenuItem,
  deleteAudioAnalysisMenuItem,
  pauseProcessingMenuItem,
  retryFailedItemsMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/permissions-shield.component";
import { List } from "immutable";

const audioAnalysisKey = "audioAnalysis";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-audio-analysis",
  template: "<baw-client></baw-client>",
})
class AudioAnalysisComponent extends PageComponent {}

AudioAnalysisComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysisMenuItem,
  menus: {
    actions: List([
      audioAnalysisResultsMenuItem,
      retryFailedItemsMenuItem,
      pauseProcessingMenuItem,
      deleteAudioAnalysisMenuItem,
    ]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [audioAnalysisKey]: analysisJobResolvers.show },
});

export { AudioAnalysisComponent };
