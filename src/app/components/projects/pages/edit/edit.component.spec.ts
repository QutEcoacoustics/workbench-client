import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ProjectsService } from "@baw-api/project/projects.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import { Project } from "@models/Project";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { generateProject, generateProjectMeta } from "@test/fakes/Project";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import schema from "../../project.schema.json";
import { ProjectEditComponent } from "./edit.component";

describe("ProjectsEditComponent", () => {
  const { fields } = schema;
  let api: SpyObject<ProjectsService>;
  let spec: SpectatorRouting<ProjectEditComponent>;
  let defaultProject: Project;

  const createComponent = createRoutingFactory({
    component: ProjectEditComponent,
    declarations: [MockComponent(FormComponent)],
    imports: [MockBawApiModule],
    mocks: [ToastService],
  });

  assertPageInfo(ProjectEditComponent, "Edit");

  function setup(project: Project): void {
    spec = createComponent({
      data: {
        resolvers: { project: "resolver" },
        project: { model: project },
      } as IPageInfo,
    });
    api = spec.inject(ProjectsService);
    spec.detectChanges();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultProject.addMetadata(generateProjectMeta());
  });

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Project Name Input",
        field: fields[0],
        key: "name",
        label: "Project Name",
        type: "input",
        inputType: "text",
        required: true,
      },
      {
        testGroup: "Project Description Input",
        field: fields[1],
        key: "description",
        label: "Description",
        type: "textarea",
      },
      {
        testGroup: "Project Image Input",
        field: fields[2],
        key: "image",
        label: "Image",
        type: "image",
      },
      {
        testGroup: "Project Allow Original Download",
        field: fields[3],
        key: "allowOriginalDownload",
        label: "Allow whole audio recording downloads",
        type: "select",
      },
      {
        testGroup: "Project Allow Recording Uploads",
        field: fields[4],
        key: "allowAudioUpload",
        label: "Allow audio recording uploads",
        type: "checkbox",
      },
    ]);
  });

  describe("capability fields", () => {
    describe("updateAllowAudioUpload capability", () => {
      function getField() {
        return spec.component.fields.find(
          (field) => field.key === "allowAudioUpload"
        );
      }

      it("should hide allowAudioUpload field when unset", () => {
        defaultProject.addMetadata(
          generateProjectMeta({
            capabilities: {
              createHarvest: { can: false, details: "Unset in test" },
              updateAllowAudioUpload: { can: false, details: "Unset in test" },
            },
          })
        );
        setup(defaultProject);
        spec.detectChanges();
        expect(getField()).not.toBeTruthy();
      });

      it("should show allowAudioUpload field when set", () => {
        defaultProject.addMetadata(
          generateProjectMeta({
            capabilities: {
              createHarvest: { can: false, details: "Unset in test" },
              updateAllowAudioUpload: { can: true, details: null },
            },
          })
        );
        setup(defaultProject);
        spec.detectChanges();
        expect(getField()).toBeTruthy();
      });
    });
  });

  describe("component", () => {
    it("should create", () => {
      setup(defaultProject);
      expect(spec.component).toBeInstanceOf(ProjectEditComponent);
    });

    it("should call api", () => {
      setup(defaultProject);
      api.update.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.update).toHaveBeenCalled();
    });
  });
});
