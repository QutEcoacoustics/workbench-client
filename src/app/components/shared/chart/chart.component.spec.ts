import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SpectatorRouting, createRoutingFactory } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { ToastrService } from "ngx-toastr";
import { VisualizationSpec } from "vega-embed";
import { Data } from "vega-lite/build/src/data";
import { ChartComponent } from "./chart.component";

describe("ChartComponent", () => {
  let spectator: SpectatorRouting<ChartComponent>;
  let defaultSpec: VisualizationSpec;
  let defaultData: unknown;

  const createComponent = createRoutingFactory({
    component: ChartComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup() {
    spectator = createComponent({ detectChanges: false })

    defaultData = [];
    defaultSpec = { data: defaultData } as VisualizationSpec;

    spectator.component.spec = defaultSpec;
    spectator.component.data = defaultData as Data;

    spectator.detectChanges();
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(ChartComponent);
  });
});
