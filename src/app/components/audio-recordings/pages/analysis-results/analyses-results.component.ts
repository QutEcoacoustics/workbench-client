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
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { first, lastValueFrom, Observable, takeUntil } from "rxjs";

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
    private route: ActivatedRoute
  ) {
    super();
  }

  public rows$: Observable<AnalysisJobItemResult[]>;
  private readonly routeData = this.route.snapshot.data;
  private readonly audioRecording: AudioRecording = this.routeData[audioRecordingKey]?.model;
  private rows = Array<AnalysisJobItemResult>();

  public get analysisJob() {
    // since this component is currently only used for default analysis jobs, we can hard code the attributes of this job
    return new AnalysisJob({
      name: "system",
      id: "system",
    });
  }

  public ngOnInit() {
    this.getItems()
      .then((items: AnalysisJobItemResult[]) => {
        this.rows = items;
        this.updateRows();
      });
  }

  public updateRows = (): Observable<AnalysisJobItemResult[]> =>
    this.rows$ = this.getRows();

  public getRows() {
    const data = new Observable<AnalysisJobItemResult[]>((observer) => {
      observer.next(this.rows);
    });
    return data;
  }

  /**
   * Fetches the `AnalysisJobItemResult` model from the baw-api
   *
   * @param model The id of the model that is requested from the baw-api
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If the item is not defined, the root path will be returned
   */
  public async getItems(model?: AnalysisJobItemResult): Promise<AnalysisJobItemResult[]> {
    return new Promise((resolveTo) => {
      const analysisJobId = this.analysisJob;
      const response = lastValueFrom(this.api
        .list(analysisJobId, this.audioRecording.id, model)
        .pipe(first())
        .pipe(
          takeUntil(this.unsubscribe)
        )
      );

      resolveTo(response);
    });
  }

  // this method needs to be refactored
  public toggleRow(model: AnalysisJobItemResult) {
    this.getModelChildren(model.children ?? [], model).then((childItems) => {
      this.addParentInformation(childItems, model);

      if (model.open) {
        // the relative path for all sub folders should include the folders name & two back slashes before and after the name
        // this prevents false positives e.g. if the folder name is contained within another folders name
        this.rows = this.rows.filter(item =>
          // only the root item will not have a parent item, in this case, we can quickly determine that all folders need to be closed
          !isInstantiated(item.parentItem) ||
          !item.parentItem.path.includes(`/${model.name}/`) ||
          item.name === model.name
        );
      } else {
        this.rows.splice(this.rows.indexOf(model) + 1, 0, ...childItems);
      }

      model.open = !model.open;
      this.updateRows();
    });
  }

  // not all analysisJobItemResult models from the baw-api contain a path attribute therefore, we can not know the location of the item
  // therefore, by adding information about the parent object, we can easily derive the relative path and hierarchy of a sub item
  private addParentInformation(models: AnalysisJobItemResult[], parent: AnalysisJobItemResult) {
    models.forEach(analysisJobItemResultItem => {
      analysisJobItemResultItem.parentItem = parent;
    });
  }

  /**
   * Sub directories of `AnalysisJobItemResults` do not contain all the information needed e.g. How many child items the sub directory has.
   * Therefore, we need to evaluate the child sub directory items explicitly and use their `AnalysisJobItemResult` model.
   *
   * @param children The models children elements as defined in the `model.children` attribute
   * @param parent The model parent `AnalysisJobItemResult`
   * @returns The child elements of the parent model in the form of an `AnalysisJobItemResult` array
   */
  private async getModelChildren(
    children: AnalysisJobItemResult[],
    parent: AnalysisJobItemResult
  ): Promise<AnalysisJobItemResult[]> {
    const evaluatedSubItems = Array<AnalysisJobItemResult>();

    // file elements do not have to be evaluated, so we can return the child items as specified in the children attribute
    children.forEach(childItem => {
      if (childItem.type === "file") {
        evaluatedSubItems.push(childItem);
      }
    });

    const directoryItems = children.filter(item => !evaluatedSubItems.includes(item));

    return new Promise((resolveTo) => {
      if (directoryItems.length === 0) {
        resolveTo(evaluatedSubItems);
      }

      directoryItems.forEach(async directory => {
        this.getItems(directory)
          .then((folderSubDirectory) => {
            folderSubDirectory.forEach(directorySubItem => {
              if (directorySubItem.path !== parent.path) {
                evaluatedSubItems.push(directorySubItem);
              }
            });
            resolveTo(evaluatedSubItems);
          });
      });
    });
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
