import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  audioEventProvenanceResolvers,
  AudioEventProvenanceService,
} from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
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
import { ProvenanceEditComponent } from "./edit.component";

describe("ProvenanceEditComponent", () => {
  let provenanceApi: SpyObject<AudioEventProvenanceService>;
  let defaultProvenance: AudioEventProvenance;
  let spectator: SpectatorRouting<ProvenanceEditComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceEditComponent,
    imports: [FormComponent],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo<AudioEventProvenance>(ProvenanceEditComponent, "Edit", {
    provenance: {
      model: new AudioEventProvenance(generateAudioEventProvenance()),
    },
  });

  function setup(provenance: AudioEventProvenance) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          provenance: audioEventProvenanceResolvers.show,
        },
        provenance: { model: provenance },
      },
    });
    provenanceApi = spectator.inject(AudioEventProvenanceService);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProvenance = new AudioEventProvenance(
      generateAudioEventProvenance({ name: "Test Provenance" })
    );
  });

  it("should create", () => {
    setup(defaultProvenance);
    expect(spectator.component).toBeTruthy();
  });

  it("should have title", () => {
    setup(defaultProvenance);
    expect(spectator.component.title).toBe("Edit Test Provenance");
  });

  it("should have fields", () => {
    setup(defaultProvenance);
    expect(spectator.component.fields.length).toBe(schema.fields.length);
  });

  it("should call update on submission", () => {
    setup(defaultProvenance);
    provenanceApi.update.and.returnValue(of(defaultProvenance));

    const data: Partial<IAudioEventProvenance> = {
      name: "Updated Provenance",
    };
    spectator.component.submit(data);

    expect(provenanceApi.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: "Updated Provenance" })
    );
  });
});
