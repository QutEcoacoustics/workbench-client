import { Component, Input } from "@angular/core";
import { rootPath } from "@components/audio-recordings/pages/analysis-results/analyses-results.component";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";

@Component({
  selector: "baw-directory-row",
  templateUrl: "analyses-download-row.component.html",
  styleUrls: ["analyses-download-row.component.scss"],
})
export class DirectoryRowComponent {
  public constructor() {}

  @Input() public item: AnalysisJobItemResult;
  @Input() public even: boolean;
  public open: boolean;

  public downloadAnalysisResults() {
    throw new Error("Downloading Analysis Results not Implemented...");
  }

  protected indentation(): Array<void> {
    const subPaths = this.item.resultsPath.split("/");
    return Array(this.isRoot ? 0 : subPaths.length);
  }

  protected setOpen(): void {
    if (this.isFolder) {
      this.open = !this.open;
    }
  }

  public get isRoot(): boolean {
    return this.item?.resultsPath === rootPath;
  }

  public get isFolder(): boolean {
    return !this.itemName.includes(".");
  }

  public get itemName(): string {
    return this.item?.resultsPath.split("/").slice(-1)[0];
  }
}
