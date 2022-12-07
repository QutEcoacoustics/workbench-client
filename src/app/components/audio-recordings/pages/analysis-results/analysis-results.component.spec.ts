import { FormsModule } from "@angular/forms";
import { DirectoryExplorerComponent } from "@components/audio-recordings/components/directory-row/directory-explorer.component";
import { DirectoryRowComponent } from "@components/audio-recordings/components/directory-row/directory-row.component";
import {
  FaLayersComponent,
} from "@fortawesome/angular-fontawesome";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { SpectatorHost, createHostFactory } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import { ToastrService } from "ngx-toastr";
import { AnalysisResultsComponent } from "./analysis-results.component";

describe("analysisResultsComponent", () => {
  let spectator: SpectatorHost<AnalysisResultsComponent>;

  const createHost = createHostFactory({
    declarations: [
      NgbTooltip,
      FaLayersComponent,
      DirectoryExplorerComponent,
      DirectoryRowComponent,
    ],
    component: AnalysisResultsComponent,
    imports: [FormsModule],
      mocks: [ToastrService],
  });

  const setup = () =>
    (spectator = createHost("<baw-analysis-results></baw-analysis-results>"));

  const getDirectoryRow = (index: number): HTMLElement =>
    spectator.queryAll<HTMLElement>("baw-directory-row")[index];

  it("should create", () => {
    setup();
    spectator.detectChanges();
    expect(spectator.component).toBeInstanceOf(AnalysisResultsComponent);
  });

  // this is only temporary until we have the API's functional
  it("should have a disabled zip download button for folders", () => {
    const mockDirectoryStructure: AnalysisJobItemResult[] = [
      new AnalysisJobItemResult(
        generateAnalysisJobResults({
          resultsPath: "/",
          children: [
            new AnalysisJobItemResult(
              generateAnalysisJobResults({
                resultsPath: "/FolderA",
              })
            ),
          ],
        })
      ),
    ];

    setup();

    spyOn<any>(spectator.component, "getItemResults").and.returnValue(
      mockDirectoryStructure
    );

    // detect changes is not initially called by setup because we need to mock the getItemResults()
    // method before we render the component
    spectator.detectChanges();

    // get /FolderA and asset that it has the greyed out download zip button
    const folderAElement = getDirectoryRow(0);
    const downloadButton = folderAElement.getElementsByTagName("button")[0];

    expect(downloadButton.disabled).toBeTrue();
  });
});
