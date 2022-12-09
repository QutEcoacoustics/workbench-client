import { Component, OnInit } from "@angular/core";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { analysisJobResultsDemoData } from "@test/fakes/AnalysisJobItemResult";
import { Observable, of } from "rxjs";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

export const rootPath = "/";

@Component({
  selector: "baw-analyses-results",
  templateUrl: "analyses-results.component.html",
  styleUrls: ["analyses-results.component.scss"]
})
export class AnalysesResultsComponent extends PageComponent implements OnInit {
  public constructor(
  ) {
    super();
  }

  public rows$: Observable<AnalysisJobItemResult[]>;
  private rows = this.getItemResults();
  public getRows$: Observable<AnalysisJobItemResult[]> = of(this.rows);

  public ngOnInit(): void {
      this.rows$ = this.getRows$;
  }

  // at the moment this always returns demo data as we are awaiting server implementation
  public getItemResults(): AnalysisJobItemResult[] {
    return analysisJobResultsDemoData;
  }

}

function getPageInfo(
  subRoute: keyof typeof audioRecordingMenuItems.analyses
): IPageInfo {
  return {
    pageRoute: audioRecordingMenuItems.analyses[subRoute],
    category: audioRecordingsCategory,
    resolvers: {
      [audioRecordingKey]: audioRecordingResolvers.show,
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

AnalysesResultsComponent.linkToRoute(getPageInfo("base"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("project"));
function generateAnalysisJob(): import("@models/AnalysisJob").IAnalysisJob {
  throw new Error("Function not implemented.");
}

