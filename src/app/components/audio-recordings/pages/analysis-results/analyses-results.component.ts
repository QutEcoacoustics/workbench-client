import { Component, OnInit } from "@angular/core";
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
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult, AnalysisJobItemResultViewModel } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { Observable, map, of, takeUntil } from "rxjs";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

export const rootPath = "/analysis_jobs/system/results/";

@Component({
  selector: "baw-analyses-results",
  templateUrl: "analyses-results.component.html",
  styleUrls: ["analyses-results.component.scss"],
})
export class AnalysesResultsComponent extends PageComponent implements OnInit {
  public constructor(
    public api: AnalysisJobItemResultsService,
    public route: ActivatedRoute
  ) {
    super();
  }

  public rows$: Observable<AnalysisJobItemResultViewModel[]>;
  private readonly routeData = this.route.snapshot.data;
  public audioRecording: AudioRecording = this.routeData[audioRecordingKey]?.model;
  private rows = Array<AnalysisJobItemResultViewModel>();
  private rootItemPath: string;

  public get analysisJob(): AnalysisJob {
    // since this component is currently only used for default analysis jobs, we can hard code the attributes of this job
    return new AnalysisJob({
      id: "system",
      name: "system",
    });
  }

  public ngOnInit() {
    this.rootItemPath = `${rootPath}${this.audioRecording.id}/`;

    const rootItem = new AnalysisJobItemResult({
      name: "",
      path: this.rootItemPath,
      type: "directory"
    });

    this.rows = [rootItem];
    this.updateRows();
  }

  public updateRows = (): Observable<AnalysisJobItemResult[]> =>
    this.rows$ = of(this.rows);

  /**
   * Fetches the `AnalysisJobItemResult` model from the baw-api
   *
   * @param model The id of the model that is requested from the baw-api
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If the item is not defined, the root path will be returned
   */
  public getItem(model?: AnalysisJobItemResult): Observable<AnalysisJobItemResult> {
    const analysisJobId = this.analysisJob;
    return this.api.show(model, analysisJobId, this.audioRecording.id);
  }

  public toggleRow(model: AnalysisJobItemResultViewModel): void {
    if (model.open) {
      this.rows = this.rows.filter(item =>
        // if the path is the root folder, all the following conditions will fail, except for the last `item.name === model.name`
        // causing all folders to collapse
        model.path !== this.rootItemPath &&
        // because POSIX compliant file names cannot include backslashes, we can use this quick operator to check if the file path
        // of the item includes the folder that was clicked on. The two backslashes before and after are needed to ensure that
        // folders such as `folderA` and `folderAa` would not match (as they would with `includes(model.name)`).
        !item.path.includes(`/${model.name}/`) ||
        // this condition ensures that the folder that was clicked on is always preserved after the filter
        item.name === model.name
      );
    } else {
      this.getModelChildren(model)
        .pipe(map(returnedValues => this.rows.splice(this.rows.indexOf(model) + 1, 0, ...returnedValues)))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
    }

    model.open = !model.open;
    this.updateRows();
  }

  /**
   * returns a models child items by evaluating the object using the baw-api and adds path information to the model
   * this helper method is intended to take a partial model, as is present in a complete models children attribute.
   *
   * @param model A model with a name attribute to evaluate the child items of
   * @returns The models child items
   */
  public getModelChildren(
    model: AnalysisJobItemResult,
  ): Observable<AnalysisJobItemResult[]> {
    return new Observable(subscriber => {
      this.getItem(model)
        // add the path information to all child items
        .pipe(map(returnedValue => this.childItemsWithPathInformation(returnedValue)))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe({
          next(modelChildren) {
            subscriber.next(modelChildren);
          }
        });
    });
  }

  /**
   * Takes an AnalysisJobItemResult model and returns the child items, with the `path` information attribute
   *
   * @param model An AnalysisJobItemResults to fetch the children of
   * @returns An array of `AnalysisJobItemResult` representing the child items inside the model
   */
  private childItemsWithPathInformation(model: AnalysisJobItemResult): AnalysisJobItemResult[] {
    const evaluatedSubItems = Array<AnalysisJobItemResult>();

    model.children.forEach(item => {
      evaluatedSubItems.push(
        new AnalysisJobItemResult({
          path: model.path + item.name,
          type: "file",
          ...item
        })
      );
    });

    return evaluatedSubItems;
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

AnalysesResultsComponent
  .linkToRoute(getPageInfo("base"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("project"));
