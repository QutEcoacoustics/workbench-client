import { Component } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  audioAnalysisCategory,
  audioAnalysisResultsMenuItem,
  downloadAudioAnalysisResultsMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { List } from "immutable";

const audioAnalysisKey = "audioAnalysis";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-audio-analysis-results",
  template: "<baw-client></baw-client>",
})
class AudioAnalysisResultsComponent extends PageComponent {}

AudioAnalysisResultsComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysisResultsMenuItem,
  menus: {
    actions: List([downloadAudioAnalysisResultsMenuItem]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [audioAnalysisKey]: analysisJobResolvers.show },
});

export { AudioAnalysisResultsComponent };
