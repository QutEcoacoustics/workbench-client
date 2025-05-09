import { Component } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { List } from "immutable";
import { AnalysisJobComponent } from "@components/audio-analysis/pages/details/details.component";
import { DetailViewComponent } from "@shared/detail-view/detail-view.component";
import {
  adminAnalysisJobMenuItem,
  adminAnalysisJobsCategory,
} from "../analysis-jobs.menus";

const analysisJobKey = "analysisJob";

@Component({
    selector: "baw-admin-analysis-job",
    templateUrl: "../../../audio-analysis/pages/details/details.component.html",
    imports: [DetailViewComponent]
})
class AdminAnalysisJobComponent extends AnalysisJobComponent {}

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
