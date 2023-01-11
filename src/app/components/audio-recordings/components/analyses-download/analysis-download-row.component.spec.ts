import { fakeAsync, flush } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnalysesDownloadRowComponent } from "@components/audio-recordings/components/analyses-download/analysis-download-row.component";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { createComponentFactory, mockProvider, Spectator } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import { ToastrService } from "ngx-toastr";

describe("analysesResultsComponent", () => {
  let spectator: Spectator<AnalysesDownloadRowComponent>;
  let defaultAnalysisJobItemResult: AnalysisJobItemResult;
  let defaultAnalysisJobItemResultParent: AnalysisJobItemResult;
  let defaultRowNode: ResultNode;

  const createComponent = createComponentFactory({
    component: AnalysesDownloadRowComponent,
    imports: [FormsModule, MockBawApiModule],
    mocks: [ToastrService],
    providers: [
      mockProvider(AnalysisJobItemResultsService)
    ]
  });

  const createAnalysisJobItemResult = (): AnalysisJobItemResult =>
    new AnalysisJobItemResult(generateAnalysisJobResults());

  const getDirectoryRow = (): HTMLSpanElement =>
    spectator.query<HTMLSpanElement>(".directory-listing-item");

  const getDirectoryRowDownloadButton = (): HTMLAnchorElement =>
    spectator.query<HTMLAnchorElement>("a");

  const getFileName = (): string =>
    // there is a new line after the {{ itemName }} mustache for code formatting / code legibility purposes.
    // this makes the code easier to read, but adds a space character after the mustache that is not visible to the user.
    // therefore, as it is not of importance to the tests, we need to trim the trailing whitespace
    getDirectoryRow().innerText.trimEnd();

  function setup() {
    spectator = createComponent({
      props: {
        item: defaultRowNode
      }
    });

    spectator.component.item = defaultRowNode;
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultAnalysisJobItemResult = createAnalysisJobItemResult();
    defaultAnalysisJobItemResultParent = createAnalysisJobItemResult();

    defaultRowNode = {
      parentItem: defaultAnalysisJobItemResultParent,
      result: defaultAnalysisJobItemResult
    } as ResultNode;
  });

  fit("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(AnalysesDownloadRowComponent);
  });

  it("should display the file name correctly", () => {
    setup();
    const realizedFileName = getFileName();
    expect(realizedFileName).toEqual(defaultAnalysisJobItemResult.name);
  });

  it("should display a download button next to file", () => {
    setup();
    const downloadButtonElement = getDirectoryRowDownloadButton();
    expect(downloadButtonElement).not.toHaveClass("disabled");
  });

  // this test is only temporary until downloading analysis result items as zip files is functional
  it("should display a disabled download button next to folder types", fakeAsync(() => {
    defaultAnalysisJobItemResult = new AnalysisJobItemResult(
      generateAnalysisJobResults({
        type: "directory"
      })
    );

    setup();

    flush();

    const downloadButtonElement = getDirectoryRowDownloadButton();
    expect(downloadButtonElement).toHaveClass("disabled");
  }));
});

interface ResultNode {
  result?: AnalysisJobItemResult;
  parentItem?: AnalysisJobItemResult;
}
