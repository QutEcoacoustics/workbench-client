import { Component } from "@angular/core";
import { adminAnalysisJobsMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { List } from "immutable";
import { AnalysesComponent } from "@components/audio-analysis/pages/list/list.component";
import { adminAnalysisJobsCategory } from "../analysis-jobs.menus";

@Component({
  selector: "baw-admin-analysis-jobs",
  templateUrl: "../../../audio-analysis/pages/list/list.component.html",
})
class AdminAnalysisJobsComponent extends AnalysesComponent {
  public override get project() {
    return null;
  }
 }

AdminAnalysisJobsComponent.linkToRoute({
  category: adminAnalysisJobsCategory,
  pageRoute: adminAnalysisJobsMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminAnalysisJobsComponent };
