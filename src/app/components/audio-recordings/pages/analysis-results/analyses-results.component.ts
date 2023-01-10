import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import {
  analysisJobResolvers,
  AnalysisJobsService,
} from "@baw-api/analysis/analysis-jobs.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { compareByPath } from "@helpers/files/files";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { Observable, map, takeUntil, of, firstValueFrom, pipe } from "rxjs";

const audioRecordingKey = "audioRecording";
const analysisJobKey = "analysisJob";
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
    public resultsServiceApi: AnalysisJobItemResultsService,
    public analysisJobsServiceApi: AnalysisJobsService,
    public route: ActivatedRoute
  ) {
    super();
  }

  public rows$: Observable<ResultNode[]>;
  private readonly routeData = this.route.snapshot.data;
  public audioRecording: AudioRecording =
    this.routeData[audioRecordingKey]?.model;
  public analysisJob: AnalysisJob =
    this.routeData[analysisJobKey]?.model ??
    this.analysisJobsServiceApi.systemAnalysisJob;
  private rows = Array<ResultNode>();

  public ngOnInit() {
    this.getNodeChildren()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.rows = x;
        // set up an observable so that rows$ updates when the value of this.rows changes
        this.rows$ = new Observable((subscribers) => subscribers.next(this.rows));
      });
  }

  /**
   * Fetches the `AnalysisJobItemResult` model from the baw-api and returns an Observable of type AnalysisJobItemResult
   *
   * @param node An incomplete result node that must include the result node name or id attribute
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If no model is not defined, the root path will be returned
   */
  public getItem(node?: ResultNode): Observable<AnalysisJobItemResult> {
    const analysisJobId = this.analysisJob;
    return this.resultsServiceApi.show(
      node?.result,
      analysisJobId,
      this.audioRecording.id
    );
  }

  private closeRow(node: ResultNode): void {
    this.rows = this.rows.filter((row) => this.isChildOf(row, node));
    node.open = false;

    // for some reason this is needed
    // TODO: remove the following line
    this.rows$ = of(this.rows);
  }

  private openRow(node: ResultNode): void {
    this.getNodeChildren(node)
      // since we have evaluated the children of the node, append this information to the node
      // so that we don't have to re-query this information in the future from the API
      .pipe(map((children) => (node.children = children)))
      .pipe(
        map((returnedValues) => {
          this.rows = this.rows
            .concat(returnedValues)
            .sort((a, b) =>
              compareByPath(this.nodeRelativePath(a), this.nodeRelativePath(b))
            );
          this.rows$ = of(this.rows);
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();

    node.open = true;

    this.rows$ = of(this.rows);
  }

  public toggleRow(node: ResultNode): void {
    if (node.open) {
      this.closeRow(node);
    } else {
      this.openRow(node);
    }
  }

  /**
   * returns a nodes child items by evaluating the object using the baw-api and adds path information to the node
   * this helper method is intended to take a partial node, as is present in a complete nodes children attribute.
   *
   * @param node A node with a name attribute to evaluate the child items of
   * @returns An array of type `ResultNode` representing the child items, of the node, the child items parent, and their path
   */
  public getNodeChildren(node?: ResultNode): Observable<ResultNode[]> {
    return (
      this.getItem(node)
        // add the path & parent information to all child items
        .pipe(
          map((returnedValue) =>
            this.childItemsWithParentInformation(returnedValue)
          )
        )
    );
  }

  /**
   * Takes a view model and returns the child items, with the `path`, `analysisJobId`, and `audioRecordingId` attributes
   *
   * @param model A view model to fetch the children of
   * @returns An array of nodes representing the child items in the model
   */
  private childItemsWithParentInformation(
    model: AnalysisJobItemResult
  ): ResultNode[] {
    return model.children.map(
      (item) =>
        ({
          parentItem: model,
          result: new AnalysisJobItemResult({ ...item }),
        } as ResultNode)
    );
  }

  private subDirectoriesCount(path: string): number {
    return path.split("/").length;
  }

  protected getIndentation(node: ResultNode): Array<void> {
    const nodePath = this.nodeRelativePath(node);
    const subPaths = this.subDirectoriesCount(nodePath);

    // because the path of folders end with a slash e.g. /folderA/aa/, we need to subtract one path count
    // because files do not end with a trailing backslash, we can calculate the path count directly, without any subtraction
    const indentationAmount = subPaths - this.subDirectoriesCount(rootPath) - 1;

    return Array<void>(indentationAmount);
  }

  private isChildOf(node: ResultNode, parent: ResultNode): boolean {
    return parent.result.path.includes(node.result.path);
  }

  private nodeRelativePath(node: ResultNode): string {
    if (!isInstantiated(node.parentItem)) {
      return rootPath;
    }

    return node.result.path ?? node.parentItem.path + node.result.name;
  }
}

interface ResultNode {
  result?: AnalysisJobItemResult;
  children?: ResultNode[];
  parentItem?: AnalysisJobItemResult;
  open?: boolean;
}

function getPageInfo(
  subRoute: keyof typeof audioRecordingMenuItems.analyses
): IPageInfo {
  return {
    pageRoute: audioRecordingMenuItems.analyses[subRoute],
    category: audioRecordingsCategory,
    resolvers: {
      [analysisJobKey]: analysisJobResolvers.showOptional,
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
