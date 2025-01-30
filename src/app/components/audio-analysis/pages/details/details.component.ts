import { Component } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  audioAnalysisCategory,
  audioAnalysisMenuJobItem,
  audioAnalysisJobResultsMenuItem,
  deleteAudioAnalysisMenuItem,
  pauseProcessingMenuItem,
  retryFailedItemsMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { List } from "immutable";

const audioAnalysisKey = "audioAnalysis";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-audio-analysis",
  template: "<baw-client></baw-client>",
})
class AudioAnalysisJobComponent extends PageComponent {}

AudioAnalysisJobComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysisMenuJobItem,
  menus: {
    actions: List([
      audioAnalysisJobResultsMenuItem,
      retryFailedItemsMenuItem,
      pauseProcessingMenuItem,
      deleteAudioAnalysisMenuItem,
    ]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [audioAnalysisKey]: analysisJobResolvers.show },
});

export { AudioAnalysisJobComponent as AudioAnalysisComponent };
