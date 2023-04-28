import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { IconPrefix } from "@fortawesome/fontawesome-common-types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AnalysisJob } from "@models/AnalysisJob";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
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
  @Output() public loadChildren = new EventEmitter<AnalysisJobItemResult>();
  public open: boolean;

  protected toggleOpen(): void {
    if (this.item.result.isFolder()) {
      this.open = !this.open;
      this.loadChildren.emit(this.item.result);
    }
  }

  protected get itemName(): string {
    return this.item.label ?? this.item.result.name;
  }

  protected get downloadUrl(): string {
    return this.api.downloadUrl(this.item.parentItem.path + this.item.result.name);
  }

  protected get isDirectoryItem(): boolean {
    return !this.itemName.includes("Load more");
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
      } else {
        return [iconClass, "folder-closed"];
      }
    }

    return [iconClass, "file"];
  }
}

interface ResultNode {
  result?: AnalysisJobItemResult;
  parentItem?: AnalysisJobItemResult;
  label?: string;
}
