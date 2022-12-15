import { FormsModule } from "@angular/forms";
import { AnalysisJobItemResultsService } from "@baw-api/analysis/analysis-job-item-result.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnalysesDownloadRowComponent } from "@components/audio-recordings/components/analyses-download/analysis-download-row.component";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { createHostFactory, mockProvider, SpectatorHost } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import { ToastrService } from "ngx-toastr";
import { AnalysisDownloadWhitespaceComponent } from "./analysis-download-whitespace.component";

describe("analysesResultsComponent", () => {
  let spectator: SpectatorHost<AnalysesDownloadRowComponent>;

  const createHost = createHostFactory({
    declarations: [AnalysisDownloadWhitespaceComponent],
    component: AnalysesDownloadRowComponent,
    imports: [FormsModule, MockBawApiModule],
    mocks: [ToastrService],
    providers: [
      mockProvider(AnalysisJobItemResultsService)
    ]
  });

  const createAnalysisJobItemResult = (): AnalysisJobItemResult =>
    new AnalysisJobItemResult(generateAnalysisJobResults());

  function setup() {
    const defaultAnalysisJobItemResult = createAnalysisJobItemResult();

    spectator = createHost(
      "<baw-directory-row></baw-directory-row>",
      {
        props: {
          item: defaultAnalysisJobItemResult
        }
      }
    );

    spectator.component.item = defaultAnalysisJobItemResult;
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnalysesDownloadRowComponent);
  });
});
