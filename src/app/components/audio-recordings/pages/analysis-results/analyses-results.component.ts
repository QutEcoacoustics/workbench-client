import { Component, Injector, OnInit } from "@angular/core";
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
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { Observable, map, takeUntil } from "rxjs";

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

  public rows$: Observable<ViewModel[]>;
  private readonly routeData = this.route.snapshot.data;
  public audioRecording: AudioRecording = this.routeData[audioRecordingKey]?.model;
  private rows = Array<ViewModel>();
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

    const rootItem = new ViewModel({
      name: "",
      path: this.rootItemPath,
      type: "directory"
    });

    this.rows = [rootItem];

    this.rows$ = new Observable(subscribers => {
      subscribers.next(this.rows);
    });
  }

  /**
   * Fetches the `AnalysisJobItemResult` model from the baw-api
   *
   * @param model The id of the model that is requested from the baw-api
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If the item is not defined, the root path will be returned
   */
  public getItem(model?: ViewModel): Observable<AnalysisJobItemResult> {
    const analysisJobId = this.analysisJob;
    return this.api.show(model, analysisJobId, this.audioRecording.id);
  }

  private closeRow(model: ViewModel): void {
    model.children?.forEach(child => {
      // remove the child element from the rows
      this.rows.splice(this.rows.indexOf(child), 1);

      // close all the child elements of the row
      this.closeRow(child)
    });

    model.open = false;
  }

  private openRow(model: ViewModel): void {
    this.getModelChildren(model)
      // append the child information to the view model
      .pipe(map(children => model.children = children))
      .pipe(map(returnedValues => this.rows.splice(this.rows.indexOf(model) + 1, 0, ...returnedValues)))
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();

    model.open = true;
  }

  public toggleRow(model: ViewModel): void {
    if (model.open) {
      this.closeRow(model);
    } else {
      this.openRow(model);
    }
  }

  /**
   * returns a models child items by evaluating the object using the baw-api and adds path information to the model
   * this helper method is intended to take a partial model, as is present in a complete models children attribute.
   *
   * @param model A model with a name attribute to evaluate the child items of
   * @returns The models child items
   */
  public getModelChildren(
    model: ViewModel,
  ): Observable<ViewModel[]> {
    return new Observable<ViewModel[]>(
      subscriber => {
        this.getItem(model)
          // add the path information to all child items
          .pipe(map(returnedValue => this.childItemsWithParentInformation(returnedValue)))
          .pipe(takeUntil(this.unsubscribe))
          .subscribe({
            next(modelChildren) {
              subscriber.next(modelChildren);
            }
          });
      }
    );
  }

  /**
   * Takes a view model and returns the child items, with the `path`, `analysisJobId`, and `audioRecordingId` attributes
   *
   * @param model A view model to fetch the children of
   * @returns An array of `AnalysisJobItemResult` representing the child items inside the model
   */
  private childItemsWithParentInformation(model: ViewModel): ViewModel[] {
    const evaluatedSubItems = Array<ViewModel>();

    model.children.forEach(item =>
      evaluatedSubItems.push(
        new ViewModel({
          path: model.path + item.name,
          type: "file",
          parentItem: model,
          ...item
        })
      )
    );

    return evaluatedSubItems;
  }

}

class ViewModel extends AnalysisJobItemResult {
  public constructor(
    analysisJobItemResults,
    injector?: Injector
  ) {
    super(analysisJobItemResults, injector);
  }

  public children?: ViewModel[];
  public open?: boolean;
  public parentItem?: AnalysisJobItemResult;
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
