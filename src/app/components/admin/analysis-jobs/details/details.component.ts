import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { adminAnalysisJobsMenuItem } from "@components/admin/admin.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { WithUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { AnalysisJob } from "@models/AnalysisJob";
import { List } from "immutable";
import { fields } from "../analysis-job.schema.json";
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
  extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public analysisJob: AnalysisJob;
  public failure: boolean;
  public fields = fields;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data as PageInfo);

    if (!models) {
      this.failure = true;
      return;
    }

    this.analysisJob = models[analysisJobKey] as AnalysisJob;
  }
}

AdminAnalysisJobComponent.LinkComponentToPageInfo({
  category: adminAnalysisJobsCategory,
  menus: {
    actions: List([adminAnalysisJobsMenuItem, adminAnalysisJobMenuItem]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [analysisJobKey]: analysisJobResolvers.show },
}).AndMenuRoute(adminAnalysisJobMenuItem);

export { AdminAnalysisJobComponent };
