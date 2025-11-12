import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { Provenance } from "@models/Provenance";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { generateProvenance } from "@test/fakes/Provenance";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { assertDetail, Detail } from "@test/helpers/detail-view";
import { ProvenanceDetailsComponent } from "./details.component";

describe("ProvenanceDetailsComponent", () => {
  let spec: SpectatorRouting<ProvenanceDetailsComponent>;
  let mockModel: Provenance | BawApiError;

  const createComponent = createRoutingFactory({
    component: ProvenanceDetailsComponent,
    providers: [provideMockBawApi()],
  });

  function setup(modelOverride?: Provenance | BawApiError): void {
    if (modelOverride) {
      mockModel = modelOverride;
    }

    spec = createComponent({
      detectChanges: false,
    });
  }

  beforeEach(() => {
    mockModel = new Provenance(generateProvenance());
  });

  assertPageInfo(ProvenanceDetailsComponent, "Test Provenance", {
    provenance: {
      model: new Provenance(generateProvenance({ name: "Test Provenance" })),
    },
  });

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(ProvenanceDetailsComponent);
  });

  it("should handle error", () => {
    setup(generateBawApiError());
    expect(spec.component).toBeTruthy();
  });

  describe("details", () => {
    const details: Detail[] = [];

    for (const detail of details) {
      assertDetail(detail);
    }
  });
});
