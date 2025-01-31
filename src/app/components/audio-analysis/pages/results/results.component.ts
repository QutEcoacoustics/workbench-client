import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import {
  audioAnalysisCategory,
  audioAnalysisJobResultsMenuItem,
  downloadAudioAnalysisResultsMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { oldClientAnalysisJobResultsRoute } from "@components/audio-analysis/audio-analysis.routes";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { AnalysisJob } from "@models/AnalysisJob";
import { List } from "immutable";

const analysisJobKey = "analysisJob";

//! Warning: This component is untested
//TODO: OLD-CLIENT REMOVE
@Component({
  selector: "baw-audio-analysis-results",
  // template: "<baw-client [page]='oldClientRoute'></baw-client>",
  template: "<baw-client page='/audio_analysis/123/results'></baw-client>",
})
class AnalysisJobResultsComponent extends PageComponent implements OnInit {
  public constructor(private route: ActivatedRoute) {
    super();
  }

  protected oldClientRoute: string;
  protected analysisJob: AnalysisJob;

  public ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data as IPageInfo);

    if (hasResolvedSuccessfully(models)) {
      this.analysisJob = models[analysisJobKey] as AnalysisJob;
      this.oldClientRoute = oldClientAnalysisJobResultsRoute.format({
        analysisJobId: this.analysisJob.id,
      });
    }
  }
}

AnalysisJobResultsComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysisJobResultsMenuItem,
  menus: {
    actions: List([downloadAudioAnalysisResultsMenuItem]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [analysisJobKey]: analysisJobResolvers.show },
});

export { AnalysisJobResultsComponent };
