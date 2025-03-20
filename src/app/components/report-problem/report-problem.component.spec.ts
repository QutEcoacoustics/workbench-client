import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import {
  createRoutingFactory,
  Spectator,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastsService } from "@services/toasts/toasts.service";
import { ReportProblemComponent } from "./report-problem.component";

describe("ReportProblemComponent", () => {
  let spectator: Spectator<ReportProblemComponent>;

  const createComponent = createRoutingFactory({
    component: ReportProblemComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastsService],
  });

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  assertPageInfo(ReportProblemComponent, "Report Problem");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ReportProblemComponent);
  });
});
