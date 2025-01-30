import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import {
  audioAnalysesMenuItem,
  audioAnalysisCategory,
  newAudioAnalysisJobMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { Project } from "@models/Project";
import { List } from "immutable";
import { DateTime } from "luxon";

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
class AudioAnalysesComponent
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

  public project: Project;

  public ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.project = models[projectKey] as Project;

    super.ngOnInit();
  }
}

AudioAnalysesComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysesMenuItem,
  menus: { actions: List([newAudioAnalysisJobMenuItem]) },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
});

export { AudioAnalysesComponent };
