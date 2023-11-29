import { SpectatorRouting, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastrService } from "ngx-toastr";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { FormComponent } from "@shared/form/form.component";
import { MockComponent } from "ng-mocks";
import { testFormlyFields } from "@test/helpers/formly";
import { Subject } from "rxjs";
import { AudioEventImport } from "@models/AudioEventImport";
import { modelData } from "@test/helpers/faker";
import schema from "../audio-event-import.schema.json";
import { NewAnnotationsComponent } from "./new.component";

describe("NewAnnotationsComponent", () => {
  const { fields } = schema;

  let spectator: SpectatorRouting<NewAnnotationsComponent>;
  let apiSpy: SpyObject<AudioEventImportService>;

  const createComponent = createRoutingFactory({
    component: NewAnnotationsComponent,
    declarations: [MockComponent(FormComponent)],
    imports: [MockBawApiModule],
    mocks: [ToastrService],
  });

  function setup(): void {
    spectator = createComponent({
      detectChanges: false,
    });

    apiSpy = spectator.inject(AudioEventImportService);
    apiSpy.create = jasmine.createSpy("create") as any;
    apiSpy.create.and.callFake(() => new Subject());

    spectator.detectChanges();
  }

  beforeEach(() => setup());

  assertPageInfo(NewAnnotationsComponent, "Import New Annotations");

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
      expect(spectator.component).toBeInstanceOf(NewAnnotationsComponent);
    });

    it("should call the api with the correct model when the form is submitted", () => {
      const model = new AudioEventImport({
        name: modelData.name.jobTitle(),
        description: modelData.description(),
      });

      spectator.component.submit(model);
      expect(apiSpy.create).toHaveBeenCalledOnceWith(model);
    });

    it("should not call the api before the form is submitted", () => {
      expect(apiSpy.create).not.toHaveBeenCalled();
    });
  });
});
