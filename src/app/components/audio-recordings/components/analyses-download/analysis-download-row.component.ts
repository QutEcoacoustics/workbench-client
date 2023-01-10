import { Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { IconPrefix } from "@fortawesome/fontawesome-common-types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
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
    public api: AnalysisJobItemResultsService
  ) {}

  public open: boolean;
  @Input() public item: AnalysisJobItemResult;
  @Input() public indentation: Array<void>;
  @Input() public analysisJob: AnalysisJob;
  @Input() public audioRecording: AudioRecording;
  @Output() public loadChildren = new EventEmitter<AnalysisJobItemResult>();

  protected toggleOpen(): void {
    if (this.item.isFolder) {
      this.open = !this.open;
      this.loadChildren.emit(this.item);
    }
  }

  protected get itemName(): string {
    return this.item?.name;
  }

  protected get downloadUrl(): string {
    return this.api.downloadUrl(
      this.analysisJob,
      this.audioRecording,
      this.item
    );
  }

  /**
   * Chooses a font awesome IconProp to use to represent the analysis item result
   *
   * @returns A font awesome IconProp that can be used in the `fa-icon` elements `[icon]` property
   */
  protected chooseIcon(): IconProp {
    const iconClass: IconPrefix = "fas";

    if (this.item.isFolder) {
      if (this.open) {
        return [iconClass, "folder-open"];
      } else {
        return [iconClass, "folder-closed"];
      }
    }

    return [iconClass, "file"];
  }
}
