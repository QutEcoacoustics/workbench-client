import { Component } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  audioAnalysesMenuItem,
  audioAnalysisCategory,
  audioAnalysisMenuItem,
  audioAnalysisResultsMenuItem,
  deleteAudioAnalysisMenuItem,
  pauseProcessingMenuItem,
  retryFailedItemsMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { List } from "immutable";

const audioAnalysisKey = "audioAnalysis";

//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-audio-analysis",
  template: "<baw-client></baw-client>",
})
class AudioAnalysisComponent extends PageComponent {}

AudioAnalysisComponent.linkComponentToPageInfo({
  category: audioAnalysisCategory,
  menus: {
    actions: List([
      audioAnalysesMenuItem,
      audioAnalysisResultsMenuItem,
      retryFailedItemsMenuItem,
      pauseProcessingMenuItem,
      deleteAudioAnalysisMenuItem,
    ]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [audioAnalysisKey]: analysisJobResolvers.show },
}).andMenuRoute(audioAnalysisMenuItem);

export { AudioAnalysisComponent };
