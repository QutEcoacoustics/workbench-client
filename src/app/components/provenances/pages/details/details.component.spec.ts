import { Router } from "@angular/router";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  audioEventProvenanceResolvers,
  AudioEventProvenanceService,
} from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import { ProvenanceDetailsComponent } from "./details.component";

describe("ProvenanceDetailsComponent", () => {
  let provenanceApi: SpyObject<AudioEventProvenanceService>;
  let routerSpy: SpyObject<Router>;
  let defaultProvenance: AudioEventProvenance;
  let spectator: SpectatorRouting<ProvenanceDetailsComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceDetailsComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo<AudioEventProvenance>(
    ProvenanceDetailsComponent,
    "test name",
    {
      provenance: {
        model: new AudioEventProvenance(
          generateAudioEventProvenance({ name: "test name" })
        ),
      },
    }
  );

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
    routerSpy = spectator.inject(Router);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProvenance = new AudioEventProvenance(
      generateAudioEventProvenance()
    );
  });

  it("should create", () => {
    setup(defaultProvenance);
    expect(spectator.component).toBeTruthy();
  });

  it("should display provenance name", () => {
    setup(defaultProvenance);
    const heading = spectator.query<HTMLHeadingElement>("h1");
    expect(heading).toContainText(defaultProvenance.name);
  });

  it("should use detail-view component", () => {
    setup(defaultProvenance);
    const detailView = spectator.query("baw-detail-view");
    expect(detailView).toBeTruthy();
  });

  describe("deleteModel", () => {
    it("should call destroy on provenance api", () => {
      setup(defaultProvenance);
      provenanceApi.destroy.and.returnValue(of(undefined));
      spectator.component.deleteModel();
      expect(provenanceApi.destroy).toHaveBeenCalledWith(defaultProvenance);
    });

    it("should navigate to provenances list on success", () => {
      setup(defaultProvenance);
      provenanceApi.destroy.and.returnValue(of(undefined));
      spectator.component.deleteModel();
      spectator.detectChanges();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith("/provenances");
    });
  });
});
