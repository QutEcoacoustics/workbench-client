import { Component } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  audioAnalysisCategory,
  audioAnalysisMenuItem,
  audioAnalysisResultsMenuItem,
  downloadAudioAnalysisResultsMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
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
  menuRoute: audioAnalysisResultsMenuItem,
  menus: {
    actions: List([
      audioAnalysisMenuItem,
      downloadAudioAnalysisResultsMenuItem,
    ]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: { [audioAnalysisKey]: analysisJobResolvers.show },
});

export { AudioAnalysisResultsComponent };
