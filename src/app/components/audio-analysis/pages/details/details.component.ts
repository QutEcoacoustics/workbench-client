import { Component, OnInit } from "@angular/core";
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
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { List } from "immutable";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvers, hasResolvedSuccessfully } from "@baw-api/resolver-common";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import schema from "../../analysis-job.schema.json";

const audioAnalysisKey = "audioAnalysis";
const analysisJobKey = "analysisJob";

@Component({
  selector: "baw-audio-analysis",
  templateUrl: "details.component.html",
})
class AudioAnalysisJobComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public analysisJob: AnalysisJob;
  public failure: boolean;
  public fields = schema.fields;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.analysisJob = models[analysisJobKey] as AnalysisJob;
  }
}

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

export { AudioAnalysisJobComponent };
