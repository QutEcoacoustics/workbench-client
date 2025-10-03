import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import {
  IAudioEventProvenance,
  AudioEventProvenance,
} from "@models/AudioEventProvenance";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import schema from "../../provenance.schema.json";
import { ProvenanceNewComponent } from "./new.component";

describe("ProvenanceNewComponent", () => {
  let provenanceApi: SpyObject<AudioEventProvenanceService>;
  let spectator: SpectatorRouting<ProvenanceNewComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceNewComponent,
    imports: [FormComponent],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo(ProvenanceNewComponent, "New Provenance");

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    provenanceApi = spectator.inject(AudioEventProvenanceService);
    spectator.detectChanges();
  });

  it("should create", () => {
    expect(spectator.component).toBeTruthy();
  });

  it("should have fields", () => {
    expect(spectator.component.fields.length).toBe(schema.fields.length);
  });

  it("should call create on submission", () => {
    const provenance = new AudioEventProvenance(
      generateAudioEventProvenance()
    );
    provenanceApi.create.and.returnValue(of(provenance));

    const data: Partial<IAudioEventProvenance> = {
      name: "New Provenance",
      version: "1.0.0",
    };
    spectator.component.submit(data);

    expect(provenanceApi.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: "New Provenance",
        version: "1.0.0",
      })
    );
  });
});
