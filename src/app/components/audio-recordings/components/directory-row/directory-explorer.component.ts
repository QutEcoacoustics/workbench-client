import { Component, Input } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";

export const rootPath = "/";

@Component({
  selector: "baw-directory-explorer",
  templateUrl: "directory-explorer.component.html",
  styleUrls: ["directory-explorer.component.scss"],
})
export class DirectoryExplorerComponent extends PageComponent {
  public constructor() {
    super();
  }

  @Input() public rows: AnalysisJobItemResult[];
}
