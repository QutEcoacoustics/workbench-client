import { Component, OnInit } from "@angular/core";
import { AnalysisJobsService } from "@baw-api/analysis/analysis-jobs.service";
import {
  audioAnalysesMenuItem,
  audioAnalysisCategory,
  newAudioAnalysisJobMenuItem,
} from "@components/audio-analysis/audio-analysis.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Param } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
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

AudioAnalysesComponent.linkToRoute({
  category: audioAnalysisCategory,
  pageRoute: audioAnalysesMenuItem,
  menus: { actions: List([newAudioAnalysisJobMenuItem]) },
});

export { AudioAnalysesComponent };
