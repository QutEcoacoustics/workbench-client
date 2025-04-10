import { Component } from "@angular/core";
import { adminAnalysisJobsMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { List } from "immutable";
import { AnalysesComponent } from "@components/audio-analysis/pages/list/list.component";
import { adminAnalysisJobsCategory } from "../analysis-jobs.menus";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "../../../../directives/datatable/defaults/defaults.directive";
import { InlineListComponent } from "../../../shared/inline-list/inline-list.component";
import { UserLinkComponent } from "../../../shared/user-link/user-link/user-link.component";
import { DatetimeComponent } from "../../../shared/datetime-formats/datetime/datetime/datetime.component";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { ErrorHandlerComponent } from "../../../shared/error-handler/error-handler.component";

@Component({
    selector: "baw-admin-analysis-jobs",
    templateUrl: "../../../audio-analysis/pages/list/list.component.html",
    imports: [NgxDatatableModule, DatatableDefaultsDirective, InlineListComponent, UserLinkComponent, DatetimeComponent, UrlDirective, ErrorHandlerComponent]
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
