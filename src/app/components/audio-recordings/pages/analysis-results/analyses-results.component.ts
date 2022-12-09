import { Component, OnChanges } from "@angular/core";
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
import { Observable } from "rxjs";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

export const rootPath = "/";

@Component({
  selector: "baw-analyses-results",
  templateUrl: "analyses-results.component.html",
  styleUrls: ["analyses-results.component.scss"],
})
export class AnalysesResultsComponent extends PageComponent implements OnChanges {
  public constructor() {
    super();
    this.getData();
  }

  public getData = (): Observable<AnalysisJobItemResult[]> => this.rows$ = this.getRows();
  public ngOnChanges = (): Observable<AnalysisJobItemResult[]> => this.getData();
  private createRootFolder = (): AnalysisJobItemResult[] => [
    new AnalysisJobItemResult({ resultsPath: rootPath, open: true }),
  ];

  public rows = this.getRootItems();
  public rows$: Observable<AnalysisJobItemResult[]>;

  public getRows() {
    const data = new Observable<AnalysisJobItemResult[]>((observer) => {
      observer.next(this.rows);
    });
    return data;
  }

  // at the moment this always returns demo data as we are awaiting server implementation
  public getRootItems(): AnalysisJobItemResult[] {
    const allItems = this.createRootFolder().concat(analysisJobResultsDemoData);
    return allItems;
  }

  public loadMore(item: AnalysisJobItemResult) {
    // check if the folder is open
    if (this.rows.indexOf(item.children[0]) === -1) {
      // the folder is closed
      this.rows.splice(this.rows.indexOf(item) + 1, 0, ...item.children);
    } else {
      // the folder is open
      this.rows = this.rows.filter(
          (folder) => !folder.resultsPath.includes(item.resultsPath) || folder.resultsPath === item.resultsPath
      );
    }

    this.getData();
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
