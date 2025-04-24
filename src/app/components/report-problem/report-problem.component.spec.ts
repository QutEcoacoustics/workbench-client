import {
  createRoutingFactory,
  Spectator,
} from "@ngneat/spectator";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { provideMockBawApi } from "@baw-api/provide-bawApiMock";
import { ReportProblemComponent } from "./report-problem.component";

describe("ReportProblemComponent", () => {
  let spectator: Spectator<ReportProblemComponent>;

  const createComponent = createRoutingFactory({
    component: ReportProblemComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertPageInfo(ReportProblemComponent, "Report Problem");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ReportProblemComponent);
  });
});
