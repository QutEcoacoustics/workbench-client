import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { ToastService } from "@services/toasts/toasts.service";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { FormComponent } from "@shared/form/form.component";
import { MockComponent } from "ng-mocks";
import { testFormlyFields } from "@test/helpers/formly";
import { Subject } from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { modelData } from "@test/helpers/faker";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import schema from "../../audio-event-import.schema.json";
import { NewAnnotationsComponent } from "./new.component";

describe("NewAnnotationsComponent", () => {
  const { fields } = schema;

  let spec: SpectatorRouting<NewAnnotationsComponent>;
  let apiSpy: SpyObject<AudioEventImportService>;

  const createComponent = createRoutingFactory({
    component: NewAnnotationsComponent,
    declarations: [MockComponent(FormComponent)],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    apiSpy = spec.inject(AudioEventImportService);
    apiSpy.create = jasmine.createSpy("create") as any;
    apiSpy.create.and.callFake(() => new Subject());

    spec.detectChanges();
  });

  assertPageInfo(NewAnnotationsComponent, "New Annotation Import");

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Import Name Input",
        field: fields[0],
        key: "name",
        label: "Import Name",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Description Input",
        field: fields[1],
        key: "description",
        label: "Description",
        type: "textarea",
        required: false,
      },
    ]);
  });

  describe("component", () => {
    it("should create", () => {
      expect(spec.component).toBeInstanceOf(NewAnnotationsComponent);
    });

    it("should call the api with the correct model when the form is submitted", () => {
      const model = new AudioEventImport({
        name: modelData.name.jobTitle(),
        description: modelData.description(),
      });

      // We should not see any api calls before submission.
      expect(apiSpy.create).not.toHaveBeenCalled();

      spec.component.submit(model);
      expect(apiSpy.create).toHaveBeenCalledOnceWith(model);
    });
  });
});
