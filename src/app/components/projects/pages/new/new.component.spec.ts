import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { FormComponent } from "@shared/form/form.component";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import schema from "../../project.schema.json";
import { ProjectNewComponent } from "./new.component";

describe("ProjectsNewComponent", () => {
  const { fields } = schema;
  let api: SpyObject<ProjectsService>;
  let spec: SpectatorRouting<ProjectNewComponent>;
  const createComponent = createRoutingFactory({
    component: ProjectNewComponent,
    declarations: [MockComponent(FormComponent)],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  assertPageInfo(ProjectNewComponent, "New Project");

  function setup(): void {
    spec = createComponent();
    api = spec.inject(ProjectsService);
    spec.detectChanges();
  }

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
        testGroup: "Project License Input",
        field: fields[3],
        key: "license",
        label: "License",
        type: "license",
      },
      {
        testGroup: "Project Allow Original Download",
        field: fields[4],
        key: "allowOriginalDownload",
        label: "Allow whole audio recording downloads",
        type: "select",
      },
      {
        testGroup: "Project Allow Recording Uploads",
        field: fields[5],
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

      it("should hide allowAudioUpload field", () => {
        setup();
        expect(getField()).not.toBeTruthy();
      });
    });
  });

  describe("component", () => {
    beforeEach(() => {
      setup();
    });

    it("should create", () => {
      expect(spec.component).toBeInstanceOf(ProjectNewComponent);
    });

    it("should call api", () => {
      api.create.and.callFake(() => new Subject());
      spec.component.submit({});
      expect(api.create).toHaveBeenCalled();
    });
  });
});
