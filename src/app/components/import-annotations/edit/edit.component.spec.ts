import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { FormsModule } from "@angular/forms";
import { ToastService } from "@services/toasts/toasts.service";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { Subject } from "rxjs";
import { testFormlyFields } from "@test/helpers/formly";
import { modelData } from "@test/helpers/faker";
import { AUDIO_EVENT_IMPORT } from "@baw-api/ServiceTokens";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import schema from "../audio-event-import.schema.json";
import { EditAnnotationsComponent } from "./edit.component";

describe("EditAnnotationsComponent", () => {
  const { fields } = schema;

  let spectator: SpectatorRouting<EditAnnotationsComponent>;
  let apiSpy: SpyObject<AudioEventImportService>;
  let defaultModel: AudioEventImport;

  const createComponent = createRoutingFactory({
    component: EditAnnotationsComponent,
    declarations: [],
    imports: [FormsModule, MockBawApiModule],
    mocks: [ToastService],
    data: {
      resolvers: {
        audioEventImport: { model: defaultModel },
      },
    },
  });

  function setup(): void {
    defaultModel = new AudioEventImport(
      generateAudioEventImport({
        name: modelData.name.jobTitle(),
        description: modelData.description(),
      })
    );

    spectator = createComponent({
      detectChanges: false,
    });

    apiSpy = spectator.inject(AUDIO_EVENT_IMPORT.token);
    apiSpy.update = jasmine.createSpy("update") as any;
    apiSpy.update.and.callFake(() => new Subject());

    spectator.component.model = defaultModel;
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  assertPageInfo(EditAnnotationsComponent, "Edit");

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
      expect(spectator.component).toBeInstanceOf(EditAnnotationsComponent);
    });

    it("should call the api with the correct model when the form is submitted", () => {
      const model = new AudioEventImport({
        name: modelData.name.jobTitle(),
        description: modelData.description(),
      });

      spectator.component.submit(model);
      expect(apiSpy.update).toHaveBeenCalledOnceWith(model);
    });

    it("should not call the api before the form is submitted", () => {
      expect(apiSpy.update).not.toHaveBeenCalled();
    });
  });
});
