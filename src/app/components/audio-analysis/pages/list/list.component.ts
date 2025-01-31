import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  audioAnalysesMenuItem,
  audioAnalysisCategory,
  newAudioAnalysisJobMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { Project } from "@models/Project";
import { List } from "immutable";
import { DateTime } from "luxon";
import { Observable } from "rxjs";

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
  selector: "baw-audio-analyses",
  templateUrl: "list.component.html",
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
        statusUpdated: analysisJob.overallStatusModifiedAt,
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

  public get project(): Project | null {
    const routeProjectModel = this.route.snapshot.data[projectKey];
    if (routeProjectModel) {
      return routeProjectModel.model;
    }

    return null;
  }

  protected override apiAction(
    filters: Filters<AnalysisJob>
  ): Observable<AnalysisJob[]> {
    const filterByProject: Filters<AnalysisJob> = {
      filter: {
        or: {
          projectId: { eq: this.project?.id },
          systemJob: { eq: true }
        },
      },
    };

    const projectScopeFilter: Filters<AnalysisJob> = this.project
      ? filterByProject
      : {};

    const actionedFilters = {
      ...projectScopeFilter,
      ...filters,
    } satisfies Filters<AnalysisJob>;

    if (this.project) {
      return this.api.filter(actionedFilters);
    }

    return this.api.filter(actionedFilters);
  }
}

AnalysesComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysesMenuItem,
  menus: { actions: List([newAudioAnalysisJobMenuItem]) },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { AnalysesComponent };
