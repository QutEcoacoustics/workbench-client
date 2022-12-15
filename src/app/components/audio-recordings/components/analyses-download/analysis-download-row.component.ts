import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { rootPath } from "@components/audio-recordings/pages/analysis-results/analyses-results.component";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { API_ROOT } from "@services/config/config.tokens";

@Component({
  selector: "baw-directory-row",
  templateUrl: "analysis-download-row.component.html",
  styleUrls: ["analysis-download-row.component.scss"],
})
export class AnalysesDownloadRowComponent {
  public constructor(
    public api: AnalysisJobItemResultsService,
    @Inject(API_ROOT) public apiRoot: string
  ) { }

  public open: boolean;
  @Input() public item: AnalysisJobItemResult;
  @Input() public parentItem: AnalysisJobItemResult;
  @Input() public even: boolean;
  @Output() public loadChildren = new EventEmitter<AnalysisJobItemResult>();

  private subDirectoriesCount = (path: string) => path.split("/").length;

  /**
   * Calculates how much indentation a certain folder needs
   *
   * @returns an empty array of length `n`, representing how many nested sub folders the item is under
   */
  protected indentation(): Array<void> {
    // some files don't have a path explicitly defined, so we need to use the name and parent item's path in these cases
    const subPaths = this.subDirectoriesCount(
      isInstantiated(this.item.path) ? this.item.path : this.relativePath
    );

    const indentationAmount = subPaths - this.subDirectoriesCount(rootPath) - 1;
    return Array<void>(indentationAmount);
  }

  protected toggleOpen(): void {
    if (this.isFolder) {
      this.open = !this.open;
      this.loadChildren.emit(this.item);
    }
  }

  public get isFolder(): boolean {
    return this.item.type === "directory";
  }

  public get itemName(): string {
    return this.item?.name;
  }

  public get downloadUrl(): string {
    // the root folder does not have a parent item, and therefore the parent item's path is optional
    return `${this.apiRoot}${this.item.parentItem?.path ?? ""}/${this.item.name}`;
  }

  /**
   * Returns the path of the analysis result item, relative to the root path
   */
   private get relativePath() {
    return `${this.item.parentItem.path}/${this.item.name}`;
  }
}
