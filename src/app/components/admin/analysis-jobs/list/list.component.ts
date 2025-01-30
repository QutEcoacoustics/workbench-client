import { Component, OnInit } from "@angular/core";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { adminAnalysisJobsMenuItem } from "@components/admin/admin.menus";
import { adminMenuItemActions } from "@components/admin/dashboard/dashboard.component";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { List } from "immutable";
import { DateTime } from "luxon";
import { adminAnalysisJobsCategory } from "../analysis-jobs.menus";

interface TableRow {
  name: Param;
  scripts: AnalysisJob;
  creator: AnalysisJob;
  started: DateTime;
  status: string;
  statusUpdated: DateTime;
  model: AnalysisJob;
}

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
    { name: "Scripts" },
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
        name: analysisJob.name,
        scripts: analysisJob,
        creator: analysisJob,
        started: analysisJob.startedAt,
        status: analysisJob.overallStatus,
        statusUpdated: analysisJob.overallStatusModifiedAt,
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
