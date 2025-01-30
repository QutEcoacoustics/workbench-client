import { Component, OnInit } from "@angular/core";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { adminAnalysisJobsMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, Ids, Param } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { List } from "immutable";
import { adminAnalysisJobsCategory } from "../analysis-jobs.menus";

@Component({
  selector: "baw-admin-analysis-jobs",
  templateUrl: "./list.component.html",
})
class AdminAnalysisJobsComponent
  extends PagedTableTemplate<TableRow, AnalysisJob>
  implements OnInit
{
  public columns = [
    { name: "Id" },
    { name: "Name" },
    { name: "Script" },
    { name: "Creator" },
    { name: "Started" },
    { name: "Status" },
    { name: "Status Updated" },
    { name: "Actions" },
  ];
  public sortKeys = {
    id: "id",
    name: "name",
    started: "startedAt",
    status: "overallStatus",
    statusUpdated: "overallStatusModifiedAt",
  };

  public constructor(api: AnalysisJobsService) {
    super(api, (analysisJobs) =>
      analysisJobs.map((analysisJob) => ({
        id: analysisJob.id,
        name: analysisJob.name,
        scripts: analysisJob.scriptIds,
        creator: analysisJob.creatorId,
        started: analysisJob.startedAt?.toRelative(),
        status: analysisJob.overallStatus,
        statusUpdated: analysisJob.overallStatusModifiedAt?.toRelative(),
        model: analysisJob,
      }))
    );
  }
}

AdminAnalysisJobsComponent.linkToRoute({
  category: adminAnalysisJobsCategory,
  pageRoute: adminAnalysisJobsMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminAnalysisJobsComponent };

interface TableRow {
  id: Id;
  name: Param;
  scripts: Ids;
  creator: Id;
  started: string;
  status: string;
  statusUpdated: string;
  model: AnalysisJob;
}
