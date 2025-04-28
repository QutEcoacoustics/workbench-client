import { Component, OnInit } from "@angular/core";
import { analysisJobResolvers } from "@baw-api/analysis/analysis-jobs.service";
import {
  analysisCategory,
  analysisJobMenuItem,
} from "@components/audio-analysis/analysis-jobs.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { List } from "immutable";
import { ActivatedRoute } from "@angular/router";
import {
  retrieveResolvers,
  hasResolvedSuccessfully,
} from "@baw-api/resolver-common";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import { projectResolvers } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { DetailViewComponent } from "@shared/detail-view/detail-view.component";
import schema from "../../analysis-job.schema.json";

const analysisJobKey = "analysisJob";
const projectKey = "project";

@Component({
  selector: "baw-analysis",
  templateUrl: "details.component.html",
  imports: [DetailViewComponent],
})
class AnalysisJobComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit
{
  public analysisJob: AnalysisJob;
  public failure: boolean;
  public fields = schema.fields;
  public project: Project;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const data = this.route.snapshot.data;
    const models = retrieveResolvers(data as IPageInfo);

    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.analysisJob = models[analysisJobKey] as AnalysisJob;
    this.project = models[projectKey] as Project;
  }
}

AnalysisJobComponent.linkToRoute({
  category: analysisCategory,
  pageRoute: analysisJobMenuItem,
  menus: {
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: {
    [analysisJobKey]: analysisJobResolvers.show,
    [projectKey]: projectResolvers.show,
  },
});

export { AnalysisJobComponent };
