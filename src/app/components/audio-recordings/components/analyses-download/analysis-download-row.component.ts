import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { rootPath } from "@components/audio-recordings/pages/analysis-results/analyses-results.component";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { API_ROOT } from "@services/config/config.tokens";

@Component({
  selector: "baw-directory-row",
  templateUrl: "analysis-download-row.component.html",
  styleUrls: ["analysis-download-row.component.scss"],
})
export class AnalysesDownloadRowComponent {
  public constructor(
    @Inject(API_ROOT) public apiRoot: string,
    public api: AnalysisJobItemResultsService,
  ) { }

  public open: boolean;
  @Input() public item: AnalysisJobItemResult;
  @Input() public analysisJob: AnalysisJob;
  @Input() public audioRecording: AudioRecording;
  @Input() public even: boolean;
  @Output() public loadChildren = new EventEmitter<AnalysisJobItemResult>();

  private subDirectoriesCount = (path: string) => path.split("/").length;

  /**
   * Calculates how much indentation a certain folder needs
   *
   * @returns an empty array object of length `n`, representing how many nested sub folders the item is under
   */
  protected indentation(): Array<void> {
    const subPaths = this.subDirectoriesCount(this.item.path);

    // because the path of folders end with a slash e.g. /folderA/aa/, we need to subtract one path count
    // because files do not end with a trailing backslash, we can calculate the path count directly, without any subtraction
    const indentationAmount = subPaths - this.subDirectoriesCount(rootPath) - (this.isFolder ? 1 : 0);
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

  public get isFile(): boolean {
    return this.item.type === "file";
  }

  public get itemName(): string {
    return this.item?.name;
  }

  public get downloadUrl(): string {
    return this.api.downloadUrl(
      this.analysisJob,
      this.audioRecording,
      this.item
    );
  }
}
