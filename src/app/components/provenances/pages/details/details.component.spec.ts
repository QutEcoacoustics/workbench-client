import { Router } from "@angular/router";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  provenanceResolvers,
  ProvenanceService,
} from "@baw-api/provenance/provenance.service";
import { Provenance } from "@models/Provenance";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { generateProvenance } from "@test/fakes/Provenance";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import { ProvenanceDetailsComponent } from "./details.component";

describe("ProvenanceDetailsComponent", () => {
  let provenanceApi: SpyObject<ProvenanceService>;
  let routerSpy: SpyObject<Router>;
  let defaultProvenance: Provenance;
  let spectator: SpectatorRouting<ProvenanceDetailsComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceDetailsComponent,
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo<Provenance>(
    ProvenanceDetailsComponent,
    "test name",
    {
      provenance: {
        model: new Provenance(
          generateProvenance({ name: "test name" })
        ),
      },
    }
  );

  function setup(provenance: Provenance) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          provenance: provenanceResolvers.show,
        },
        provenance: { model: provenance },
      },
    });
    provenanceApi = spectator.inject(ProvenanceService);
    routerSpy = spectator.inject(Router);
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProvenance = new Provenance(
      generateProvenance()
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
