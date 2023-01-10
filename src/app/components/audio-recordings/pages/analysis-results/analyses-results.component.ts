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
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { Observable, map, takeUntil, of } from "rxjs";

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
    public analysisJobsServiceApi: AnalysisJobsService,
    public route: ActivatedRoute
  ) {
    super();
  }

  public rows$: Observable<ResultNode[]>;
  private rows = Array<ResultNode>();

  private readonly routeData = this.route.snapshot.data;
  public audioRecording: AudioRecording = this.routeData[audioRecordingKey]?.model;
  // TODO: once api functionality for the system AnalysisJob is working, the if undefined condition can be removed
  public analysisJob: AnalysisJob =
    this.routeData[analysisJobKey]?.model ??
    this.analysisJobsServiceApi.systemAnalysisJob;


  public ngOnInit() {
    // by supplying zero arguments to `getNodeChildren`, it will fetch the root paths child elements and place them on the view
    this.getNodeChildren()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(x => {
        this.rows = x;
        // set up an observable so that rows$ updates when the value of this.rows changes
        this.rows$ = new Observable((subscribers) => subscribers.next(this.rows));
      });
  }

  /**
   * Fetches a single `AnalysisJobItemResult` model from the baw-api and returns an Observable of type AnalysisJobItemResult
   *
   * @param node An incomplete result node that must include the result node name or id attribute
   * @returns The complete `AnalysisJobItemResult` model of the requested item. If no model is not defined, the root path will be returned
   */
  private getItem(node?: ResultNode): Observable<AnalysisJobItemResult> {
    const analysisJobId = this.analysisJob;
    return this.resultsServiceApi.show(
      node?.result,
      analysisJobId,
      this.audioRecording.id
    );
  }

  private closeRow(node: ResultNode): void {
    this.rows = this.rows.filter(row => !this.isChildOf(row, node));

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
              compareByPath(
                a.parentItem.path + a.result.name,
                b.parentItem.path + a.result.name
              )
            );
          this.rows$ = of(this.rows);
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();

    node.open = true;
  }

  public toggleRow(node: ResultNode): void {
    if (node.open) {
      this.closeRow(node);
    } else {
      this.openRow(node);
    }
  }

  /**
   * Fetches the child elements of a result node and returns the children in the form of a resultNode array
   * with parent information.
   *
   * @param node A node with a name attribute to evaluate the child items of
   * @returns An observable of type `Array<ResultNode>` representing the child items, of the node
   */
  private getNodeChildren(node?: ResultNode): Observable<ResultNode[]> {
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
   * @returns An array of result nodes representing the child items in the model with parent information and result information
   */
  private childItemsWithParentInformation(
    model: AnalysisJobItemResult
  ): ResultNode[] {
    // FIXME: For some reason, if I don't recreate the result model, it doesn't update this.rows$, I need to figure out why
    return model.children.map(
      (item) =>
        ({
          parentItem: model,
          result: new AnalysisJobItemResult({ ...item }),
        } as ResultNode)
    );
  }

  protected getIndentation(node: ResultNode): Array<void> {
    const nodePath = node.parentItem.path + node.result.name;
    const subPaths = nodePath.split("/").length;

    // result node paths follow the format /analysis_jobs/:analysisJobId/results/:audioRecordingId/:analysisJobItemResultsPath/
    // because we are only interested in the number of paths (:analysisJobItemResultsPath), we have to subtract the leading path count (6)
    const indentationAmount = subPaths - 6;

    return Array<void>(indentationAmount);
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
