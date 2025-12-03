import {
  AudioEventImportService,
  audioEventImportResolvers,
} from "@baw-api/audio-event-import/audio-event-import.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { AudioEventImport } from "@models/AudioEventImport";
import { Project } from "@models/Project";
import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { generateProject } from "@test/fakes/Project";
import { modelData } from "@test/helpers/faker";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { BehaviorSubject, Subject } from "rxjs";
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
    imports: [...testFormImports, FormComponent],
    providers: testFormProviders,
    mocks: [ToastService],
  });

  beforeEach(() => {
    defaultModel = new AudioEventImport(
      generateAudioEventImport({
        name: modelData.name.jobTitle(),
        description: modelData.description(),
      }),
    );

    defaultProject = new Project(generateProject());

    spectator = createComponent({
      detectChanges: false,
      params: { projectId: defaultProject.id, annotationId: defaultModel.id },
      data: {
        resolvers: {
          project: projectResolvers.show,
          audioEventImport: audioEventImportResolvers.show,
        },
        project: { model: defaultProject },
        audioEventImport: { model: defaultModel },
      },
    });

    apiSpy = spectator.inject(AudioEventImportService);
    apiSpy.update = jasmine.createSpy("update") as any;
    apiSpy.update.and.callFake(() => new Subject());

    spectator.detectChanges();
  });

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

    it("should redirect to annotation import view after successful update", () => {
      const updatedModel = new AudioEventImport({
        ...generateAudioEventImport(),
        id: defaultModel.id,
        name: modelData.name.jobTitle(),
        description: modelData.description(),
      });

      apiSpy.update.and.callFake(
        () => new BehaviorSubject<AudioEventImport>(updatedModel),
      );

      spectator.component.submit(updatedModel);

      expect(spectator.router.navigateByUrl).toHaveBeenCalledWith(
        updatedModel.createViewUrl(defaultProject.id),
      );
    });
  });
});
