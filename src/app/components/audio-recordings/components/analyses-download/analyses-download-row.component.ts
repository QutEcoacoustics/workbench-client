import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AnalysisJobItemResultsService,
} from "@baw-api/analysis/analysis-job-item-result.service";
import { rootPath } from "@components/audio-recordings/pages/analysis-results/analyses-results.component";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";

@Component({
  selector: "baw-directory-row",
  templateUrl: "analyses-download-row.component.html",
  styleUrls: ["analyses-download-row.component.scss"],
})
export class AnalysesDownloadRowComponent implements OnInit {
  public constructor(public api: AnalysisJobItemResultsService) {}

  @Input() public item: AnalysisJobItemResult;
  @Input() public parentItem: AnalysisJobItemResult;
  @Input() public even: boolean;
  @Output() public loadChildren = new EventEmitter<AnalysisJobItemResult>();

  public open: boolean;
  public rawFileEndpoint = "";

  public ngOnInit() {
    const apiEndpoint = "https://api.staging.ecosounds.org";
    this.rawFileEndpoint = apiEndpoint + `${this.item.parentItem.path}${this.item.name}`;
  }

  private subDirectoriesCount = (path: string) => path.split("/").length;

  public downloadAnalysisResults() {
    throw new Error("Error! Method not implemented!");
  }

  /**
   * Calculates how much indentation a certain folder needs
   *
   * @returns an empty array of length n, representing how many nested sub folders the item is under
   */
  protected indentation(): Array<void> {
    // files don't have a path, so we need to use the name
    const subPaths = this.subDirectoriesCount(
      isInstantiated(this.item.path) ? this.item.path : this.relativePath
    );

    const indentationAmount = subPaths - this.subDirectoriesCount(rootPath) - 1;
    return Array(indentationAmount);
  }

  protected setOpen(): void {
    if (this.isFolder) {
      this.open = !this.open;
      this.loadChildren.emit(this.item);
    }
  }

  public get isRoot(): boolean {
    return this.item?.path === rootPath;
  }

  public get isFolder(): boolean {
    return this.item.type === "directory";
  }

  public get itemName(): string {
    return this.item?.name;
  }

  /**
   * Returns the path of the analysis result item, relative to the root path
   */
  public get relativePath() {
    return `${this.item.parentItem.path}/${this.item.name}`;
  }
}
