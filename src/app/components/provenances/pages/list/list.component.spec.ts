import { ProvenanceService } from "@baw-api/provenance/provenance.service";
import { Provenance } from "@models/Provenance";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { generateProvenance } from "@test/fakes/Provenance";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ToastService } from "@services/toasts/toasts.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProvenanceListComponent } from "./list.component";

describe("ProvenanceListComponent", () => {
  let api: SpyObject<ProvenanceService>;
  let spec: Spectator<ProvenanceListComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceListComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService, NgbModal],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ProvenanceService);
  });

  assertPageInfo(ProvenanceListComponent, ["Provenances"]);

  it("should create", () => {
    spec.detectChanges();
    expect(spec.component).toBeTruthy();
  });

  it("should initialize filters", () => {
    spec.detectChanges();
    expect(spec.component["filters$"]).toBeTruthy();
  });

  it("should have getModels method", () => {
    spec.detectChanges();
    expect(spec.component["getModels"]).toBeDefined();
  });
});
