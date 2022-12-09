import { FormsModule } from "@angular/forms";
import { AnalysesDownloadRowComponent } from "@components/audio-recordings/components/analyses-download/analyses-download-row.component";
import {
  AnalysisDownloadWhitespaceComponent
} from "@components/audio-recordings/components/analyses-download/analyses-download-whitespace.component";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { SpectatorHost, createHostFactory } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import { ToastrService } from "ngx-toastr";
import { AnalysesResultsComponent } from "./analyses-results.component";

describe("analysesResultsComponent", () => {
  let spectator: SpectatorHost<AnalysesResultsComponent>;

  const createHost = createHostFactory({
    declarations: [
      NgbTooltip,
      AnalysesDownloadRowComponent,
      AnalysisDownloadWhitespaceComponent,
    ],
    component: AnalysesResultsComponent,
    imports: [FormsModule],
    mocks: [ToastrService],
  });

  function setup() {
    spectator = createHost("<baw-analyses-results></baw-analyses-results>");
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  const getDirectoryRow = (index: number): HTMLElement =>
    spectator.queryAll<HTMLElement>("baw-directory-row")[index];

  const getDownloadButton = (index: number): HTMLButtonElement =>
    getDirectoryRow(index).getElementsByTagName("button")[0];

  const getDirectoryRowItemName = (index: number) =>
    getDirectoryRow(index).innerText.split("\n")[0];

  function clickFolder(index: number) {
    spectator.queryAll<HTMLElement>(".grid-table-item")[3 + 3 * index].click();
    updateComponent();
  }

  function updateComponent(): void {
    spectator.component.ngOnChanges();
    spectator.detectChanges();
  }

  function mockDirectoryStructure(newStructure: AnalysisJobItemResult[]) {
    spectator.component.rows = newStructure;
    updateComponent();

    // as we are not interested in the root folder in many of our tests
    // we need to assert that it exists, and open it up
    const rootFolder = spectator.queryAll<HTMLElement>(".grid-table-item")[3];
    expect(rootFolder).toBeTruthy();

    rootFolder.click();
    updateComponent();
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnalysesResultsComponent);
  });

  it("should display an enabled file download button for files", () => {
    const singleFolderDirectory: AnalysisJobItemResult[] = [
      new AnalysisJobItemResult(
        generateAnalysisJobResults({
          resultsPath: "/",
          children: [
            new AnalysisJobItemResult(
              generateAnalysisJobResults({
                resultsPath: "result_item.csv",
              })
            ),
          ],
        })
      ),
    ];

    mockDirectoryStructure(singleFolderDirectory);

    // get /FolderA and asset that it has the greyed out download zip button
    const downloadButton = getDownloadButton(1);

    expect(downloadButton.disabled).toBeFalse();
  });

  // this is only temporary until we have the API's functional
  it("should have a disabled zip download button for folders", () => {
    const singleFolderDirectory: AnalysisJobItemResult[] = [
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

    mockDirectoryStructure(singleFolderDirectory);

    // get /FolderA and asset that it has the greyed out download zip button
    const downloadButton = getDownloadButton(1);

    expect(downloadButton.disabled).toBeTrue();
  });

  it("should show sub directory folders and items when a folder is clicked", () => {
    const expectedFileName = "Sound_File2022-11-05T08:15:30-05:00.wav";

    const nestedFolderDirectory: AnalysisJobItemResult[] = [
      new AnalysisJobItemResult(
        generateAnalysisJobResults({
          resultsPath: "/",
          children: [
            new AnalysisJobItemResult(
              generateAnalysisJobResults({
                resultsPath: "/FolderA",
                children: [
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({
                      resultsPath: `/FolderA/${expectedFileName}`,
                    })
                  ),
                ],
              })
            ),
          ],
        })
      ),
    ];

    mockDirectoryStructure(nestedFolderDirectory);

    // click on folderA/, the first folder in the directory tree (excluding the root folder)
    clickFolder(1);

    // assert that the sub_folder under A is shown
    expect(getDirectoryRowItemName(2)).toEqual(expectedFileName);
  });

  it("should remove all sub-folders from model if a folder is clicked on while open", () => {
    const folderAaaTestingFileName = "assertMe.csv";
    const nestedFolderDirectory: AnalysisJobItemResult[] = [
      new AnalysisJobItemResult(
        generateAnalysisJobResults({
          resultsPath: "/",
          children: [
            new AnalysisJobItemResult(
              generateAnalysisJobResults({
                resultsPath: "/FolderA",
                children: [
                  new AnalysisJobItemResult(
                    generateAnalysisJobResults({
                      resultsPath: "/FolderA/aa",
                      children: [
                        new AnalysisJobItemResult(
                          generateAnalysisJobResults({
                            resultsPath: `/FolderA/aa/${folderAaaTestingFileName}`,
                          })
                        ),
                        new AnalysisJobItemResult(
                          generateAnalysisJobResults({})
                        ),
                      ],
                    })
                  ),
                ],
              })
            ),
          ],
        })
      ),
    ];

    mockDirectoryStructure(nestedFolderDirectory);

    // open folderA
    clickFolder(1);

    // open sub folder folderA/aa
    clickFolder(2);

    // assert that folderA/aa is open
    expect(getDirectoryRowItemName(3)).toEqual(folderAaaTestingFileName);

    // close folderA
    clickFolder(1);

    // assert that folderA/aa is closed
    expect(getDirectoryRow(3)).toBeUndefined();
  });
});
