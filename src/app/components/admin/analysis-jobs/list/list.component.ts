import { Component, OnInit } from '@angular/core';
import { AnalysisJobsService } from '@baw-api/analysis/analysis-jobs.service';
import {
  adminAnalysisJobsMenuItem,
  adminDashboardMenuItem,
} from '@components/admin/admin.menus';
import { adminMenuItemActions } from '@components/admin/dashboard/dashboard.component';
import { PagedTableTemplate } from '@helpers/tableTemplate/pagedTableTemplate';
import { Id, Param } from '@interfaces/apiInterfaces';
import { AnalysisJob } from '@models/AnalysisJob';
import { List } from 'immutable';
import {
  adminAnalysisJobMenuItem,
  adminAnalysisJobsCategory,
} from '../analysis-jobs.menus';

@Component({
  selector: 'baw-admin-analysis-jobs',
  templateUrl: './list.component.html',
})
class AdminAnalysisJobsComponent
  extends PagedTableTemplate<TableRow, AnalysisJob>
  implements OnInit {
  public columns = [
    { name: 'Id' },
    { name: 'Name' },
    { name: 'Script' },
    { name: 'Creator' },
    { name: 'Started' },
    { name: 'Status' },
    { name: 'Status Updated' },
    { name: 'Actions' },
  ];
  public sortKeys = {
    id: 'id',
    name: 'name',
    started: 'startedAt',
    status: 'overallStatus',
    statusUpdated: 'overallStatusModifiedAt',
  };

  constructor(api: AnalysisJobsService) {
    super(api, (analysisJobs) =>
      analysisJobs.map((analysisJob) => ({
        id: analysisJob.id,
        name: analysisJob.name,
        script: analysisJob.scriptId,
        creator: analysisJob.creatorId,
        started: analysisJob.startedAt.toRelative(),
        status: analysisJob.overallStatus,
        statusUpdated: analysisJob.overallStatusModifiedAt.toRelative(),
        model: analysisJob,
      }))
    );
  }
}

AdminAnalysisJobsComponent.LinkComponentToPageInfo({
  category: adminAnalysisJobsCategory,
  menus: { actions: List([adminDashboardMenuItem, ...adminMenuItemActions]) },
}).AndMenuRoute(adminAnalysisJobsMenuItem);

export { AdminAnalysisJobsComponent };

interface TableRow {
  id: Id;
  name: Param;
  script: Id;
  creator: Id;
  started: string;
  status: string;
  statusUpdated: string;
  model: AnalysisJob;
}
