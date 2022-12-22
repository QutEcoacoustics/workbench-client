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
    getDirectoryRow().textContent;

  function setup() {
    spectator = createComponent({
      props: {
        item: defaultAnalysisJobItemResult
      }
    });

    spectator.component.item = defaultAnalysisJobItemResult;
    spectator.detectChanges();
  }

  beforeEach(() => defaultAnalysisJobItemResult = createAnalysisJobItemResult());

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(AnalysesDownloadRowComponent);
  });

  it("should display the file name correctly", () => {
    const expectedFileName = "test.csv";
    defaultAnalysisJobItemResult = new AnalysisJobItemResult(
      generateAnalysisJobResults({
        name: expectedFileName
      })
    );

    setup();

    const realizedFileName = getFileName();

    expect(realizedFileName).toEqual(` ${expectedFileName} `);
  });

  it("should display a download button next to file", () => {
    setup();
    const downloadButtonElement = getDirectoryRowDownloadButton();
    expect(downloadButtonElement).toBeTruthy();
  });
});
