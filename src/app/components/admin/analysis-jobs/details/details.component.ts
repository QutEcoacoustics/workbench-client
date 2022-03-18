import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { AnalysisJob } from "@models/AnalysisJob";
import { List } from "immutable";
import schema from "../analysis-job.schema.json";
import {
  adminAnalysisJobMenuItem,
  adminAnalysisJobsCategory,
} from "../analysis-jobs.menus";

const analysisJobKey = "analysisJob";

@Component({
  selector: "baw-admin-analysis-job",
  template: `
    <div *ngIf="!failure">
      <h1>Analysis Job Details</h1>
      <baw-detail-view
        [fields]="fields"
        [model]="analysisJob"
      ></baw-detail-view>
    </div>
  `,
})
class AdminAnalysisJobComponent
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

AdminAnalysisJobComponent.linkToRoute({
  category: adminAnalysisJobsCategory,
  pageRoute: adminAnalysisJobMenuItem,
  menus: {
    actions: List([adminAnalysisJobMenuItem]),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [analysisJobKey]: analysisJobResolvers.show },
});

export { AdminAnalysisJobComponent };
