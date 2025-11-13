import { createRoutingFactory, SpectatorRouting, SpyObject } from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { MockComponent } from "ng-mocks";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ToastService } from "@services/toasts/toasts.service";
import { ProvenanceService } from "@baw-api/provenance/provenance.service";
import { of } from "rxjs";
import { Provenance } from "@models/Provenance";
import { generateProvenance } from "@test/fakes/Provenance";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import schema from "../../provenance.base.schema.json";
import { NewProvenanceComponent } from "./new.component";

describe("NewProvenanceComponent", () => {
  const { fields } = schema;

  let spec: SpectatorRouting<NewProvenanceComponent>;
  let apiSpy: SpyObject<ProvenanceService>;

  const createComponent = createRoutingFactory({
    component: NewProvenanceComponent,
    declarations: [MockComponent(FormComponent)],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    apiSpy = spec.inject(ProvenanceService);
    apiSpy.create.and.returnValue(of());

    spec.detectChanges();
  });

  assertPageInfo(NewProvenanceComponent, "New Provenance");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(NewProvenanceComponent);
  });

  it("should call the api with the correct model when the form is submitted", () => {
    const model = new Provenance(generateProvenance());

    expect(apiSpy.create).not.toHaveBeenCalled();

    spec.component.submit(model);
    expect(apiSpy.create).toHaveBeenCalledOnceWith(model);
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Provenance Name Input",
        field: fields[1],
        key: "name",
        label: "Provenance Name",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Version Input",
        field: fields[2],
        key: "version",
        label: "Version",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Description Input",
        field: fields[3],
        key: "description",
        label: "Description",
        type: "textarea",
      },
      {
        testGroup: "Score Minimum Input",
        field: fields[4],
        key: "scoreMinimum",
        label: "Score Minimum",
        type: "input",
        inputType: "number",
        required: false,
      },
      {
        testGroup: "Score Maximum Input",
        field: fields[5],
        key: "scoreMaximum",
        label: "Score Maximum",
        type: "input",
        inputType: "number",
        required: false,
      },
    ]);
  });
});
