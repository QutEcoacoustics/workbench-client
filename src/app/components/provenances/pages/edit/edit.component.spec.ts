import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { generateProvenance } from "@test/fakes/Provenance";
import { Provenance } from "@models/Provenance";
import {
  provenanceResolvers,
  ProvenanceService,
} from "@baw-api/provenance/provenance.service";
import { of } from "rxjs";
import { testFormlyFields } from "@test/helpers/formly";
import schema from "../../provenance.base.schema.json";
import { EditProvenanceComponent } from "./edit.component";

describe("EditProvenanceComponent", () => {
  const { fields } = schema;

  let spec: SpectatorRouting<EditProvenanceComponent>;
  let apiSpy: SpyObject<ProvenanceService>;
  let mockModel: Provenance;

  const createComponent = createRoutingFactory({
    component: EditProvenanceComponent,
    imports: [...testFormImports, FormComponent],
    providers: testFormProviders,
    mocks: [ToastService],
  });

  beforeEach(() => {
    mockModel = new Provenance(generateProvenance());

    spec = createComponent({
      detectChanges: false,
      params: { provenanceId: mockModel.id },
      data: {
        resolvers: {
          provenance: provenanceResolvers.show,
        },
        provenance: { model: mockModel },
      },
    });

    apiSpy = spec.inject(ProvenanceService);
    apiSpy.update.and.returnValue(of());

    spec.detectChanges();
  });

  assertPageInfo(EditProvenanceComponent, "Edit");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(EditProvenanceComponent);
  });

  it("should call the api with the correct model when the form is submitted", () => {
    const updatedModel = new Provenance(generateProvenance());
    spec.component.submit(updatedModel);
    expect(apiSpy.update).toHaveBeenCalledWith(updatedModel);
  });

  it("should redirect correctly after submission", () => {
    const updatedModel = new Provenance(generateProvenance());
    apiSpy.update.and.returnValue(of(updatedModel));

    expect(apiSpy.update).not.toHaveBeenCalled();

    spec.component.submit(mockModel);

    expect(spec.router.navigateByUrl).toHaveBeenCalledWith(
      `/provenances/${updatedModel.id}`,
    );
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
        required: false,
      },
      {
        testGroup: "Description Input",
        field: fields[3],
        key: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
      {
        testGroup: "URL Input",
        field: fields[4],
        key: "url",
        label: "URL",
        type: "input",
        inputType: "url",
        required: false,
      },
      {
        testGroup: "Score Minimum Input",
        field: fields[5],
        key: "scoreMinimum",
        label: "Score Minimum",
        type: "input",
        inputType: "number",
        required: false,
      },
      {
        testGroup: "Score Maximum Input",
        field: fields[6],
        key: "scoreMaximum",
        label: "Score Maximum",
        type: "input",
        inputType: "number",
        required: false,
      },
    ]);
  });
});
