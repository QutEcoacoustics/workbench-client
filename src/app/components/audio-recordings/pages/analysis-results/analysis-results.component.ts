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
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
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
import { Observable, map, takeUntil } from "rxjs";

const audioRecordingKey = "audioRecording";
const analysisJobKey = "analysisJob";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

export enum ResultNodeType {
  file,
  folder,
  loadMore,
}

export interface ResultNode {
  rowType: ResultNodeType;
  result?: AnalysisJobItemResult;
  children?: ResultNode[];
  parentItem?: AnalysisJobItemResult;
  open?: boolean;
  onClick?: () => void;
}

@Component({
  selector: "baw-analysis-results",
  templateUrl: "analysis-results.component.html",
  styleUrls: ["analysis-results.component.scss"],
})
export class AnalysisResultsComponent extends PageComponent implements OnInit {
  public constructor(
    public resultsServiceApi: AnalysisJobItemResultsService,
    public route: ActivatedRoute
  ) {
    super();
  }

  private models: ResolvedModelList;
  protected rows = Array<ResultNode>();

  public get audioRecording(): AudioRecording {
    return this.models[audioRecordingKey] as AudioRecording;
  }

  public get analysisJob(): AnalysisJob {
    // TODO: once api functionality for the system AnalysisJob is working, the if undefined, then systemAnalysisJob condition can be removed
    // this is needed because the system analysis job cannot be resolved by the api yet (as it uses a text descriptor not integer id)
    return (this.models[analysisJobKey] ?? systemAnalysisJob) as AnalysisJob;
  }

  public ngOnInit() {
    this.models = retrieveResolvers(this.route.snapshot.data);

    // by supplying zero arguments to `getNodeChildren`, it will fetch the root paths child elements and place them on the view
    this.getNodeChildren()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((rootChildren: ResultNode[]) => {
        // validate that the response is valid and has analysis job item results.
        // If not, throw an error and display the error to the user in the form of a toast notification
        if (rootChildren.length === 0) {
          throw new BawApiError(
            NOT_FOUND,
            "Could not find Analysis Job Item Results. If you believe this to be an error, please report a problem."
          );
        }

        this.rows = rootChildren;

        this.rows = this.rows.sort((a, b) => compareByPath(this.getNodePath(a), this.getNodePath(b)));
      });
  }

  /**
   * Fetches a single `AnalysisJobItemResult` model from the baw-api and returns an Observable of type AnalysisJobItemResult
   *
   * @param node An incomplete result node that must include the result node name or id attribute
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If no model is not defined, the root path will be returned
   */
  public getItem(node: ResultNode): Observable<AnalysisJobItemResult> {
    return this.resultsServiceApi.show(
      node?.result,
      this.analysisJob,
      this.audioRecording
    );
  }

  public toggleRow(node: ResultNode): void {
    if (node.onClick instanceof Function) {
      node.onClick();
    }

    if (node.open) {
      this.closeRow(node);
    } else {
      this.openRow(node);
    }
  }

  protected getIndentation(node: ResultNode): number {
    const nodePath = this.getNodePath(node);
    const subPaths = nodePath.split("/").length;

    // result node paths follow the format `/analysis_jobs/:analysisJobId/results/:audioRecordingId/:analysisJobItemResultsPath/`
    // because we are only interested in the number of paths (:analysisJobItemResultsPath), we have to subtract the leading path count (6)
    const indentationAmount = subPaths - 6;

    return indentationAmount;
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

    // since only folders can be opened, we do not need to iterate through every child item. We only need to close folder items
    const nodeChildFolders: ResultNode[] = node.children.filter((child: ResultNode) => child.rowType === ResultNodeType.folder);

    if (nodeChildFolders.length) {
      nodeChildFolders.forEach((child: ResultNode) => this.closeRow(child));
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
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((children: ResultNode[]) => {
        node.children = children;
        this.rows = this.rows
          .concat(children)
          .sort((a: ResultNode, b: ResultNode) =>
            compareByPath(
              this.getNodePath(a),
              this.getNodePath(b)
            )
          );
      });

    node.open = true;
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
        // transform each AnalysisJobItemResult into a ResultNode. This requires the addition path and parent information to each child node
        .pipe(
          map((returnedValue: AnalysisJobItemResult): ResultNode[] =>
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
    const modelChildren = model.children.map(
      (item): ResultNode => ({
        rowType: item?.isFile() ? ResultNodeType.file : ResultNodeType.folder,
        parentItem: model,
        result: item as AnalysisJobItemResult,
      })
    );

    if (
      model.getMetadata().paging.page < model.getMetadata().paging.maxPage &&
      model.getMetadata().paging.total !== 0
    ) {
      const loadMoreRow = this.createLoadMoreRow(model);
      return modelChildren.concat(loadMoreRow)
    }

    return modelChildren;
  }

  private createLoadMoreRow(parent: AnalysisJobItemResult): ResultNode {
    const loadMoreRow: ResultNode = {
      rowType: ResultNodeType.loadMore,
      parentItem: parent,
      result: {
        name: parent.name,
        path: parent.getMetadata().paging.next,
      } as AnalysisJobItemResult,
      onClick: () => {
        this.rows = this.rows.filter(
          (row) =>
            row.rowType !== ResultNodeType.loadMore && row !== loadMoreRow
        );
      },
    };

    return loadMoreRow;
  }

  private getNodePath(node: ResultNode): string {
    return node.parentItem.path + node.result.name;
  }

  private isChildOf(node: ResultNode, parent: ResultNode): boolean {
    return node.parentItem.path === parent.result.path;
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
      [analysisJobKey]: analysisJobResolvers.showOptional,
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

AnalysisResultsComponent.linkToRoute(getPageInfo("base"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("project"));
