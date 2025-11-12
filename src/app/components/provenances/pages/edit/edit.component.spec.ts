import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import {
  provenanceResolvers,
  ProvenanceService,
} from "@baw-api/provenance/provenance.service";
import {
  IProvenance,
  Provenance,
} from "@models/Provenance";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateProvenance } from "@test/fakes/Provenance";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { of } from "rxjs";
import schema from "../../provenance.schema.json";
import { ProvenanceEditComponent } from "./edit.component";

describe("ProvenanceEditComponent", () => {
  let provenanceApi: SpyObject<ProvenanceService>;
  let defaultProvenance: Provenance;
  let spectator: SpectatorRouting<ProvenanceEditComponent>;

  const createComponent = createRoutingFactory({
    component: ProvenanceEditComponent,
    imports: [FormComponent],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo<Provenance>(ProvenanceEditComponent, "Edit", {
    provenance: {
      model: new Provenance(generateProvenance()),
    },
  });

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
    spectator.detectChanges();
  }

  beforeEach(() => {
    defaultProvenance = new Provenance(
      generateProvenance({ name: "Test Provenance" })
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

    const data: Partial<IProvenance> = {
      name: "Updated Provenance",
    };
    spectator.component.submit(data);

    expect(provenanceApi.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: "Updated Provenance" })
    );
  });
});
