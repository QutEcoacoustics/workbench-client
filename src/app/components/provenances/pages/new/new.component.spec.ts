import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ProvenanceService } from "@baw-api/provenance/provenance.service";
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
import { ProvenanceNewComponent } from "./new.component";

describe("ProvenanceNewComponent", () => {
  let provenanceApi: SpyObject<ProvenanceService>;
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
    provenanceApi = spectator.inject(ProvenanceService);
    spectator.detectChanges();
  });

  it("should create", () => {
    expect(spectator.component).toBeTruthy();
  });

  it("should have fields", () => {
    expect(spectator.component.fields.length).toBe(schema.fields.length);
  });

  it("should call create on submission", () => {
    const provenance = new Provenance(
      generateProvenance()
    );
    provenanceApi.create.and.returnValue(of(provenance));

    const data: Partial<IProvenance> = {
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
