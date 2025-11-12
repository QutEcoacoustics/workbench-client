import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  analysesMenuItem,
  analysisCategory,
} from "@components/audio-analysis/analysis-jobs.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { Project } from "@models/Project";
import { DateTime } from "luxon";
import { Observable } from "rxjs";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { DatetimeComponent } from "@shared/datetime-formats/datetime/datetime/datetime.component";
import { UrlDirective } from "@directives/url/url.directive";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";

interface TableRow {
  name: Param;
  scripts: AnalysisJob;
  creator: AnalysisJob;
  started: DateTime;
  status: string;
  statusUpdated: DateTime;
  model: AnalysisJob;
}

const projectKey = "project";

@Component({
  selector: "baw-analyses",
  templateUrl: "./list.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    InlineListComponent,
    UserLinkComponent,
    DatetimeComponent,
    UrlDirective,
    ErrorHandlerComponent,
  ],
})
class AnalysesComponent extends PagedTableTemplate<TableRow, AnalysisJob> {
  public constructor(
    protected api: AnalysisJobsService,
    protected route: ActivatedRoute
  ) {
    super(api, (analysisJobs) =>
      analysisJobs.map((analysisJob) => ({
        name: analysisJob.name,
        scripts: analysisJob,
        creator: analysisJob,
        started: analysisJob.startedAt,
        status: analysisJob.overallStatus,
        statusUpdated: analysisJob.updatedAt,
        model: analysisJob,
      }))
    );
  }

  public columns = [
    { name: "Id" },
    { name: "Name" },
    { name: "Scripts" },
    { name: "Creator" },
    { name: "Started" },
    { name: "Status" },
    { name: "Updated" },
    { name: "Actions" },
  ];

  public sortKeys = {
    id: "id",
    name: "name",
    started: "startedAt",
    status: "overallStatus",
    statusUpdated: "overallStatusModifiedAt",
  };

  public get project(): Project | null {
    const routeProjectModel = this.route.snapshot.data[projectKey];
    if (routeProjectModel) {
      return routeProjectModel.model;
    }

    // we should never reach this case but I throw an error in this case so that
    // the page will hard fail and the user won't be stuck in untested and
    // partial/buggy site state
    throw new Error("Project is not defined in route");
  }

  protected override apiAction(
    filters: Filters<AnalysisJob>
  ): Observable<AnalysisJob[]> {
    if (!this.project) {
      return this.api.filter(filters);
    }

    const filterByProject: Filters<AnalysisJob> = {
      filter: {
        or: {
          projectId: { eq: this.project.id },
          systemJob: { eq: true },
        },
      },
    };

    const actionedFilters = {
      ...filters,
      ...filterByProject,
    } satisfies Filters<AnalysisJob>;

    return this.api.filter(actionedFilters);
  }
}

AnalysesComponent.linkToRoute({
  category: analysisCategory,
  pageRoute: analysesMenuItem,
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { AnalysesComponent };
