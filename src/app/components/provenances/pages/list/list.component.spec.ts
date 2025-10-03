import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ToastService } from "@services/toasts/toasts.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProvenanceListComponent } from "./list.component";

describe("ProvenanceListComponent", () => {
  let api: SpyObject<AudioEventProvenanceService>;
  let spec: Spectator<ProvenanceListComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceListComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService, NgbModal],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(AudioEventProvenanceService);
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
