import { Component, OnChanges, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Id } from "@interfaces/apiInterfaces";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { Observable } from "rxjs";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

export const rootPath = "/analysis_jobs/system/results/";

// GET request for all analysis results for audio recording 1
// https://api.staging.ecosounds.org/analysis_jobs/system/results/1

// GET request for all audio recording results
// https://api.staging.ecosounds.org/analysis_jobs/system/results/

// GET request for analysis item for audio recording 1
// https://api.staging.ecosounds.org/analysis_jobs/system/audio_recordings/1

// GET request for all analyses
// https://api.staging.ecosounds.org/analysis_jobs/system/audio_recordings/

@Component({
  selector: "baw-analyses-results",
  templateUrl: "analyses-results.component.html",
  styleUrls: ["analyses-results.component.scss"],
})
export class AnalysesResultsComponent
  extends PageComponent
  implements OnChanges, OnInit
{
  public constructor(
    public api: AnalysisJobItemResultsService,
    private route: ActivatedRoute
  ) {
    super();
    this.updateRows();
  }

  public rows = [];
  protected rows$: Observable<AnalysisJobItemResult[]>;
  private audioRecording: AudioRecording;

  public ngOnChanges = (): Observable<AnalysisJobItemResult[]> =>
    this.updateRows();

  public ngOnInit() {
    const routeData = this.route.snapshot.data;
    this.audioRecording = routeData[audioRecordingKey]?.model;
    this.rows = this.getItems();
  }

  public updateRows = (): Observable<AnalysisJobItemResult[]> =>
    (this.rows$ = this.getRows());

  // this job is currently permanently set to the default audio analysis job
  public analysisJob(): AnalysisJob {
    return new AnalysisJob({
      name: "system",
      id: "system",
    });
  }

  public getRows() {
    const data = new Observable<AnalysisJobItemResult[]>((observer) => {
      observer.next(this.rows);
    });
    return data;
  }

  public getItems(path?: AnalysisJobItemResult): AnalysisJobItemResult[] {
    const analysisJobId = this.analysisJob();
    this.api
      .list(analysisJobId, this.audioRecordingId, path)
      // eslint-disable-next-line rxjs-angular/prefer-takeuntil
      .subscribe({
        next: (site) => this.rows.push(site[0]),
        error: () => (this.rows = []),
      });
    return this.rows;
  }

  public loadMore(item: AnalysisJobItemResult) {
    const itemChildren = Array<AnalysisJobItemResult>();

    if (isInstantiated(item.children)) {
      item.children.forEach((child) => {
        if (child.type === "directory") {
          this.getItems(child).forEach(childItem => {
            if (childItem.path !== item.path) {
              itemChildren.push(childItem);
            }
          });
        }
        if (child.children !== Array(0) && child.hasChildren !== true) {
          itemChildren.push(child);
        }
      });
    }

    // add the parent item information
    itemChildren.forEach((analysisJobItemResultItem) => {
      analysisJobItemResultItem.parentItem = item;
    });

    // this is where we should check if the folder is closed or open
    // if open, close the folder
    if (this.rows.indexOf(item.children[0]) === -1) {
      this.rows.splice(this.rows.indexOf(item) + 1, 0, ...itemChildren);
    } else {
      this.rows = this.rows.filter(
        (ar) => !itemChildren.find(rm => (rm.name === ar.name))
      );
    }
    this.updateRows();
  }

  public get audioRecordingId(): Id {
    const routeData = this.route.snapshot.data;
    this.audioRecording = routeData[audioRecordingKey]?.model;
    return this.audioRecording.id;
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
