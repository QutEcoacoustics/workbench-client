import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import {
  analysisJobResolvers,
  systemAnalysisJob,
} from "@baw-api/analysis/analysis-jobs.service";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { compareByPath } from "@helpers/files/files";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { NOT_FOUND } from "http-status";
import { ToastrService } from "ngx-toastr";
import { Observable, map, takeUntil } from "rxjs";

const audioRecordingKey = "audioRecording";
const analysisJobKey = "analysisJob";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-analyses-results",
  templateUrl: "analyses-results.component.html",
  styleUrls: ["analyses-results.component.scss"],
})
export class AnalysesResultsComponent extends PageComponent implements OnInit {
  public constructor(
    public resultsServiceApi: AnalysisJobItemResultsService,
    public notifications: ToastrService,
    public route: ActivatedRoute
  ) {
    super();
  }

  private readonly routeData = this.route.snapshot.data;
  protected rows = Array<ResultNode>();
  public audioRecording: AudioRecording = this.routeData[audioRecordingKey]?.model;
  // TODO: once api functionality for the system AnalysisJob is working, the "if undefined, then systemAnalysisJob" condition can be removed
  public analysisJob: AnalysisJob =
    this.routeData[analysisJobKey]?.model ??
    systemAnalysisJob;

  public ngOnInit() {
    // by supplying zero arguments to `getNodeChildren`, it will fetch the root paths child elements and place them on the view
    this.getNodeChildren()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(rootChildren => {
        // validate that the response is valid and has analysis job item results.
        // If not, throw an error and display the error to the user in the form of a toast notification
        if (rootChildren.length < 1) {
          const errorMessage = "Could not find Analysis Job Item Results. If you believe this to be an error, please report a problem.";
          this.notifications.error(errorMessage);
          throw new BawApiError(NOT_FOUND, errorMessage);
        }

        this.rows = rootChildren;
      });
  }

  /**
   * Fetches a single `AnalysisJobItemResult` model from the baw-api and returns an Observable of type AnalysisJobItemResult
   *
   * @param node An incomplete result node that must include the result node name or id attribute
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If no model is not defined, the root path will be returned
   */
  public getItem(node?: ResultNode): Observable<AnalysisJobItemResult> {
    const analysisJobId = this.analysisJob;

    if (node?.result?.path) {
      return this.resultsServiceApi.show(
        node.result.path,
        analysisJobId,
        this.audioRecording
      );
    }

    return this.resultsServiceApi.show(
      node?.result,
      analysisJobId,
      this.audioRecording
    );
  }

  /**
   * Recursive: close all the child elements of a row
   * This method needs to be recursive so it can close folders of more than 1 depth.
   * e.g. closing folderA/ will close FolderA/aa/bb/
   *
   * @param node A result node / row to close
   */
  private closeRow(node: ResultNode): void {
    this.rows = this.rows.filter((row) => !this.isChildOf(row, node));

    // close the children of the children, etc.. all the way down the tree
    if (node.children) {
      node.children.forEach((child) => this.closeRow(child));
    }

    node.open = false;
  }

  /**
   * Opens an analysis result folder, and sorts the child items by path
   *
   * @param node The result node to open
   * @param isIncomplete Specifies if there are more items to be fetched from the API.
   * If `isIncomplete` is set, a "load more" button is expected
   */
  private openRow(node: ResultNode): void {
    this.getNodeChildren(node)
      .pipe(
        map((returnedValues) => {
          this.rows = this.rows
            .concat(returnedValues)
            .sort((a, b) =>
              compareByPath(
                this.getNodePath(a),
                this.getNodePath(b)
              )
            );
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();

    this.rows = this.rows.filter((row) => !(row.result.name === "Load more..." && row === node));

    node.open = true;
  }

  public toggleRow(node: ResultNode): void {
    if (node.open) {
      this.closeRow(node);
    } else {
      this.openRow(node);
    }
  }

  protected getIndentation(node: ResultNode): Array<void> {
    const nodePath = this.getNodePath(node);
    const subPaths = nodePath.split("/").length;

    // result node paths follow the format `/analysis_jobs/:analysisJobId/results/:audioRecordingId/:analysisJobItemResultsPath/`
    // because we are only interested in the number of paths (:analysisJobItemResultsPath), we have to subtract the leading path count (6)
    const indentationAmount = subPaths - 6;

    return Array<void>(indentationAmount);
  }

  /**
   * Fetches the child elements of a result node and returns the children in the form of a an resultNode array
   * with the node.parent attribute set
   *
   * @param node A result node with a name attribute
   * @returns An observable of type `Array<ResultNode>` representing the child items, of the node
   */
  private getNodeChildren(node?: ResultNode): Observable<ResultNode[]> {
    return (
      this.getItem(node)
        // add the path & parent information to all child items so this doesn't have to be required in the future
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
   * @returns An array of result nodes representing the child items in the model with parent information and result information
   */
  private childItemsWithParentInformation(
    model: AnalysisJobItemResult
  ): ResultNode[] {
    let modelChildren = model.children.map(
      (item) =>
      ({
        parentItem: model,
        result: item,
      } as ResultNode)
    );

    const hasMoreChildren = model.getMetadata().paging.page !== model.getMetadata().paging.maxPage;

    if (hasMoreChildren) {
      modelChildren = this.addLoadMoreRow(model, modelChildren);
    }

    return modelChildren;
  }

  private addLoadMoreRow(parent: AnalysisJobItemResult, loadedChildren: ResultNode[]): ResultNode[] {
    const loadMoreRow: ResultNode = {
      parentItem: parent,
      result: new AnalysisJobItemResult({
        ...parent,
        name: "Load more...",
        path: parent.getMetadata().paging["next"],
      }),
    }

    return loadedChildren.concat(loadMoreRow);
  }

  private getNodePath(node: ResultNode): string {
    return node.parentItem.path + node.result.name;
  }

  private isChildOf(node: ResultNode, parent: ResultNode): boolean {
    return node.parentItem.path === parent.result.path;
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
      [audioRecordingKey]: audioRecordingResolvers.show,
      [analysisJobKey]: analysisJobResolvers.showOptional,
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
