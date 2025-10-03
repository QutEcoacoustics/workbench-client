import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { FormsModule } from "@angular/forms";
import { ToastService } from "@services/toasts/toasts.service";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventImport } from "@models/AudioEventImport";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { of, Subject } from "rxjs";
import { testFormlyFields } from "@test/helpers/formly";
import { modelData } from "@test/helpers/faker";
import { AUDIO_EVENT_IMPORT } from "@baw-api/ServiceTokens";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { fakeAsync } from "@angular/core/testing";
import schema from "../../audio-event-import.schema.json";
import { EditAnnotationsComponent } from "./edit.component";

describe("EditAnnotationsComponent", () => {
  const { fields } = schema;

  let spectator: SpectatorRouting<EditAnnotationsComponent>;
  let apiSpy: SpyObject<AudioEventImportService>;

  let defaultModel: AudioEventImport;
  let defaultProject: Project;

  const createComponent = createRoutingFactory({
    component: EditAnnotationsComponent,
    imports: [FormsModule],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
    data: {
      resolvers: {
        audioEventImport: { model: defaultModel },
        project: { model: defaultProject },
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

    defaultProject = new Project(generateProject());

    spectator = createComponent({
      detectChanges: false,
    });

    apiSpy = spectator.inject(AUDIO_EVENT_IMPORT.token);
    apiSpy.update = jasmine.createSpy("update") as any;
    apiSpy.update.and.callFake(() => of(defaultModel));

    spectator.component.model = defaultModel;
    spectator.component.models.project = defaultProject;
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

    it("should redirect to the correct page after a successful form submission", fakeAsync(() => {
      const projectId = spectator.component["project"].id;

      spectator.component.submit(defaultModel);

      const expectedUrl = `/projects/${projectId}/import_annotations/${defaultModel.id}`;
      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(expectedUrl);
    }));
  });
});
