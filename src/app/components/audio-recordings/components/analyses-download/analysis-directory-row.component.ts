import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { ResultNode, ResultNodeType } from "@components/audio-recordings/pages/analysis-results/analysis-results.component";
import { IconPrefix } from "@fortawesome/fontawesome-common-types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AnalysisJob } from "@models/AnalysisJob";
import { AudioRecording } from "@models/AudioRecording";

@Component({
  selector: "baw-analysis-directory-row",
  templateUrl: "analysis-directory-row.component.html",
  styleUrls: ["analysis-directory-row.component.scss"],
})
export class AnalysisDirectoryRowComponent {
  public constructor(
    public api: AnalysisJobItemResultsService
  ) { }

  @Input() public item: ResultNode;
  @Input() public indentation: number;
  @Input() public analysisJob: AnalysisJob;
  @Input() public audioRecording: AudioRecording;
  @Output() public loadChildren = new EventEmitter<ResultNode>();
  public open: boolean;

  protected toggleOpen(): void {
    if (this.isLoadMoreButton || this.item.result.isFolder()) {
      this.open = !this.open;
      this.loadChildren.emit(this.item);
    }
  }

  protected get itemName(): string {
    return this.item.result.name;
  }

  protected get downloadUrl(): string {
    return this.api.downloadUrl(this.item.parentItem.path + this.item.result.name);
  }

  protected get isLoadMoreButton(): boolean {
    return this.item.rowType === ResultNodeType.loadMore;
  }

  /**
   * Chooses a font awesome IconProp to use to represent the analysis item result
   *
   * @returns A font awesome IconProp that can be used in the `fa-icon` elements `[icon]` property
   */
  protected chooseIcon(): IconProp {
    const iconClass: IconPrefix = "fas";

    if (this.item.result.isFolder()) {
      if (this.open) {
        return [iconClass, "folder-open"];
      }

      return [iconClass, "folder-closed"];
    }

    return [iconClass, "file"];
  }
}
